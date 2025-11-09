import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

export interface CartItem {
    name: string;
    price: string;
}

/**
 * CartPage Class - Clean & Simple Format
 * Elements at top, wrapper methods below
 * @author Sathish Kumar
 */
export class CartPage {
    readonly page: Page;
    
    // Cart Elements - Updated for DemoBlaze structure
    private cartItems = '#tbodyid tr';
    private cartItemNames = '#tbodyid tr td:nth-child(2)';
    private cartItemPrices = '#tbodyid tr td:nth-child(3)';
    private deleteButtons = '#tbodyid tr td:nth-child(4) a';
    private totalPrice = '#totalp';
    private placeOrderButton = 'button[data-target="#orderModal"]';
    
    // Order Form Elements
    private nameInput = '#name';
    private countryInput = '#country';
    private cityInput = '#city';
    private creditCardInput = '#card';
    private monthInput = '#month';
    private yearInput = '#year';
    private purchaseButton = 'button[onclick="purchaseOrder()"]';
    private closeButton = 'button[data-dismiss="modal"]';
    
    // Success Elements
    private successMessage = '.sweet-alert h2';
    private okButton = '.confirm';
    
    // Navigation Elements
    private homeLink = 'a.nav-link[href="index.html"]';
    
    constructor(page: Page) {
        this.page = page;
    }

    // Cart Verification Wrapper Methods
    async verifyCartPageLoaded(): Promise<void> {
        await expect(this.page).toHaveURL(/.*cart\.html/);
        await expect(this.page.locator(this.placeOrderButton)).toBeVisible();
        
        // Wait for cart to fully load (as you mentioned it takes 2-3 seconds)
        await this.page.waitForTimeout(3000);
    }

    // Cart Items Wrapper Methods
    async getCartItems(): Promise<CartItem[]> {
        // Wait for the cart table to be visible and populated (2-3 seconds as you mentioned)
        await this.page.waitForSelector('#tbodyid', { timeout: 10000 });
        
        // Wait for cart items to actually load - this addresses the 2-3 second delay
        await this.page.waitForTimeout(3000); // Wait 3 seconds as you mentioned manually
        
        const count = await this.page.locator(this.cartItems).count();
        const items: CartItem[] = [];
        
        for (let i = 0; i < count; i++) {
            const name = await this.page.locator(this.cartItemNames).nth(i).textContent() || '';
            const price = await this.page.locator(this.cartItemPrices).nth(i).textContent() || '';
            items.push({ name: name.trim(), price: price.trim() });
        }
        
        return items;
    }

    async getCartItemCount(): Promise<number> {
        try {
            // First check if we're on the cart page
            await this.page.waitForSelector('#page-wrapper', { timeout: 5000 });
            
            // Wait for cart to load
            await this.page.waitForTimeout(3000);
            
            // Try to find cart items - this might be empty if cart is empty
            const items = await this.page.locator(this.cartItems).count();
            
            // If no items found, cart is empty
            if (items === 0) return 0;
            
            // Double check if items are actually visible (not empty placeholders)
            const firstItemText = await this.page.locator(this.cartItems).first().textContent();
            return items === 1 && (!firstItemText || firstItemText.trim() === '') ? 0 : items;
        } catch (error) {
            // If cart body is not visible, it means cart is empty
            console.log('Cart appears to be empty:', error);
            return 0;
        }
    }

    async getTotalPrice(): Promise<string> {
        await expect(this.page.locator(this.totalPrice)).toBeVisible();
        return await this.page.locator(this.totalPrice).textContent() || '';
    }

    // Cart Action Wrapper Methods
    async removeItemByName(itemName: string): Promise<void> {
        const items = await this.getCartItems();
        const itemIndex = items.findIndex(item => item.name === itemName);
        
        if (itemIndex >= 0) {
            await this.page.locator(this.deleteButtons).nth(itemIndex).click();
            await this.page.waitForTimeout(1000);
        } else {
            throw new Error(`Item "${itemName}" not found in cart`);
        }
    }

    async removeAllItems(): Promise<void> {
        let itemCount = await this.getCartItemCount();
        
        while (itemCount > 0) {
            await this.page.locator(this.deleteButtons).first().click();
            await this.page.waitForTimeout(1000);
            itemCount = await this.getCartItemCount();
        }
    }

    async isCartEmpty(): Promise<boolean> {
        return (await this.getCartItemCount()) === 0;
    }

    // Order Process Wrapper Methods
    async placeOrder(): Promise<void> {
        await expect(this.page.locator(this.placeOrderButton)).toBeVisible();
        await this.page.locator(this.placeOrderButton).click();
        await this.page.waitForSelector('#orderModal', { state: 'visible' });
    }   

    async fillOrderForm(orderDetails: {
        name: string;
        country: string;
        city: string;
        creditCard: string;
        month: string;
        year: string;
    }): Promise<void> {
        await expect(this.page.locator(this.nameInput)).toBeVisible();
        
        await this.page.locator(this.nameInput).fill(orderDetails.name);
        await this.page.locator(this.countryInput).fill(orderDetails.country);
        await this.page.locator(this.cityInput).fill(orderDetails.city);
        await this.page.locator(this.creditCardInput).fill(orderDetails.creditCard);
        await this.page.locator(this.monthInput).fill(orderDetails.month);
        await this.page.locator(this.yearInput).fill(orderDetails.year);
    }

    async completePurchase(): Promise<void> {
        await this.page.locator(this.purchaseButton).click();
        
        // Wait for the sweet alert success message to appear
        await this.page.waitForSelector('.sweet-alert', { timeout: 10000 });
        await expect(this.page.locator('.sweet-alert')).toBeVisible();
    }

    async confirmPurchase(): Promise<string> {
        // Wait for OK button to be visible 
        await this.page.waitForSelector('.confirm', { timeout: 10000 });
        await expect(this.page.locator(this.okButton)).toBeVisible();
        
        // Get success text from the sweet alert
        const successText = await this.page.locator('.sweet-alert h2').textContent() || '';
        console.log('Purchase success message:', successText);
        
        await this.page.locator(this.okButton).click();
        return successText;
    }

    async closeOrderModal(): Promise<void> {
        await this.page.locator(this.closeButton).click();
        await this.page.waitForSelector('#orderModal', { state: 'hidden' });
    }

    // Validation Wrapper Methods
    async verifyItemInCart(itemName: string): Promise<boolean> {
        const items = await this.getCartItems();
        return items.some(item => item.name.includes(itemName));
    }

    async calculateExpectedTotal(): Promise<number> {
        const items = await this.getCartItems();
        return items.reduce((total, item) => {
            const price = parseFloat(item.price.replace(/[^\d.]/g, ''));
            return total + price;
        }, 0);
    }

    async verifyTotalPrice(): Promise<boolean> {
        const expectedTotal = await this.calculateExpectedTotal();
        const actualTotal = parseFloat((await this.getTotalPrice()).replace(/[^\d.]/g, ''));
        return Math.abs(expectedTotal - actualTotal) < 0.01;
    }
}