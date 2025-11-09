import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

/**
 * ProductPage Class - Clean & Simple Format
 * Elements at top, wrapper methods below
 * @author Sathish Kumar
 */
export class ProductPage {
    readonly page: Page;
    
    // Product Elements
    private productTitle = '.name';
    private productPrice = '.price-container';
    private productDescription = '#more-information p';
    private productImage = '.item.active img';
    private addToCartButton = '.btn.btn-success.btn-lg';
    
    // Navigation Elements
    private homeButton = '.nav-link[href="index.html"]';
    private cartLink = '#cartur';
    
    // Breadcrumb Elements
    private breadcrumb = '.breadcrumb';
    
    constructor(page: Page) {
        this.page = page;
    }

    // Product Information Wrapper Methods
    async getProductTitle(): Promise<string> {
        await expect(this.page.locator(this.productTitle)).toBeVisible();
        return await this.page.locator(this.productTitle).textContent() || '';
    }

    async getProductPrice(): Promise<string> {
        await expect(this.page.locator(this.productPrice)).toBeVisible();
        const priceText = await this.page.locator(this.productPrice).textContent() || '';
        return priceText.replace('*includes tax', '').trim();
    }

    async getProductDescription(): Promise<string> {
        await expect(this.page.locator(this.productDescription)).toBeVisible();
        return await this.page.locator(this.productDescription).textContent() || '';
    }

    // Product Action Wrapper Methods
    async addToCart(): Promise<void> {
        await expect(this.page.locator(this.addToCartButton)).toBeVisible();
        
        // Set up dialog handler before clicking
        const dialogPromise = this.page.waitForEvent('dialog');
        await this.page.locator(this.addToCartButton).click();
        
        const dialog = await dialogPromise;
        console.log(`Alert message: ${dialog.message()}`);
        expect(dialog.message()).toContain('Product added');
        await dialog.accept();
        
        console.log('✅ Product added to cart successfully');
    }

    async isProductImageVisible(): Promise<boolean> {
        return await this.page.locator(this.productImage).isVisible();
    }

    // Navigation Wrapper Methods
    async goBackToHome(): Promise<void> {
        await this.page.locator(this.homeButton).click();
        await this.page.waitForURL(/.*index\.html/);
    }

    async goToCart(): Promise<void> {
        await this.page.locator(this.cartLink).click();
        await this.page.waitForURL(/.*cart\.html/);
    }

    // Verification Wrapper Methods
    async verifyProductPageLoaded(expectedProductName?: string): Promise<void> {
        await expect(this.page.locator(this.productTitle)).toBeVisible();
        await expect(this.page.locator(this.productPrice)).toBeVisible();
        await expect(this.page.locator(this.addToCartButton)).toBeVisible();
        
        if (expectedProductName) {
            const actualTitle = await this.getProductTitle();
            expect(actualTitle).toContain(expectedProductName);
        }
    }

    async getProductDetails(): Promise<{title: string, price: string, description: string}> {
        return {
            title: await this.getProductTitle(),
            price: await this.getProductPrice(),
            description: await this.getProductDescription()
        };
    }
}