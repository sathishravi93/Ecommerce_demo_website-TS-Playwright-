import type { BrowserContext, Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';

/**
 * HomePage Class - Clean & Simple Format
 * Elements at top, wrapper methods below
 * @author Sathish Kumar
 */
export class HomePage {
    readonly page: Page;
    readonly context: BrowserContext;
    
    // Navigation Elements
    private homeLink = 'a.nav-link[href="index.html"]';
    private contactLink = 'a[data-target="#exampleModal"]';
    private aboutUsLink = 'a[data-target="#videoModal"]';
    private cartLink = 'a#cartur';
    private loginLink = 'a#login2';
    private signUpLink = 'a#signin2';
    private logoutLink = 'a#logout2';
    
    // Category Elements
    private phonesCategory = 'a[onclick*="phone"]';
    private laptopsCategory = 'a[onclick*="notebook"]';
    private monitorsCategory = 'a[onclick*="monitor"]';
    
    // Product Elements
    private productCards = '.card';
    private productTitles = '.card-title a';
    private productPrices = '.card-text';
    private addToCartButton = 'a[onclick*="addToCart"]';
    
    // Carousel Elements
    private nextButton = '.carousel-control-next';
    private prevButton = '.carousel-control-prev';
    
    // Alerts and Messages
    private successMessage = '.alert-success';
    private errorMessage = '.alert-danger';
    
    constructor(page: Page, context: BrowserContext) {
        this.page = page;
        this.context = context;
    }

    // Navigation Wrapper Methods
    async navigateToHomePage(): Promise<void> {
        console.log('🌐 Navigating to DemoBlaze homepage...');
        await this.page.goto('https://www.demoblaze.com/');
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.locator('#tbodyid').waitFor({ state: 'visible', timeout: 15000 });
        await expect(this.page).toHaveTitle(/STORE/);
        console.log('✅ Homepage loaded successfully');
    }

    async open(): Promise<void> {
        await this.navigateToHomePage();
    }

    async clickLogin(): Promise<void> {
        await this.page.locator(this.loginLink).click();
        await this.page.waitForSelector('#logInModal', { state: 'visible' });
    }

    async clickSignUp(): Promise<void> {
        await this.page.locator(this.signUpLink).click();
        await this.page.waitForSelector('#signInModal', { state: 'visible' });
    }

    async clickCart(): Promise<void> {
        await this.page.locator(this.cartLink).click();
        await this.page.waitForURL(/.*cart\.html/);
    }

    async clickContact(): Promise<void> {
        await this.page.locator(this.contactLink).click();
        await this.page.waitForSelector('#exampleModal', { state: 'visible' });
    }

    async clickAboutUs(): Promise<void> {
        await this.page.locator(this.aboutUsLink).click();
        await this.page.waitForSelector('#videoModal', { state: 'visible' });
    }

    // Category Filter Wrapper Methods
    async selectProductCategory(category: 'Phones' | 'Laptops' | 'Monitors'): Promise<void> {
        console.log(`🔍 Filtering products by category: ${category}`);
        
        switch (category) {
            case 'Phones':
                await this.page.locator(this.phonesCategory).click();
                break;
            case 'Laptops':
                await this.page.locator(this.laptopsCategory).click();
                break;
            case 'Monitors':
                await this.page.locator(this.monitorsCategory).click();
                break;
            default:
                throw new Error(`Invalid category: ${category}`);
        }
        
        await this.page.waitForSelector(this.productCards, { timeout: 5000 });
        console.log(`✅ Category ${category} products loaded`);
    }

    async filterByCategory(category: 'Phones' | 'Laptops' | 'Monitors'): Promise<void> {
        await this.selectProductCategory(category);
    }

    // Product Interaction Wrapper Methods
    async getProductCount(): Promise<number> {
        return await this.page.locator(this.productCards).count();
    }

    async getProductTitles(): Promise<string[]> {
        return await this.page.locator(this.productTitles).allTextContents();
    }

    async clickProductByName(productName: string): Promise<void> {
        const productLink = this.page.locator(`a:text("${productName}")`);
        await expect(productLink).toBeVisible();
        await productLink.click();
        await this.page.waitForURL(/.*prod\.html/);
    }

    async getProductPrices(): Promise<string[]> {
        return await this.page.locator(this.productPrices).allTextContents();
    }

    // Carousel Wrapper Methods
    async navigateCarousel(direction: 'next' | 'previous'): Promise<void> {
        if (direction === 'next') {
            await this.page.locator(this.nextButton).click();
        } else {
            await this.page.locator(this.prevButton).click();
        }
        await this.page.waitForTimeout(1000);
    }

    // Utility Wrapper Methods
    async verifyPageLoaded(): Promise<void> {
        await expect(this.page.locator(this.homeLink)).toBeVisible();
        await expect(this.page.locator(this.loginLink)).toBeVisible();
        await expect(this.page.locator(this.signUpLink)).toBeVisible();
        await expect(this.page.locator(this.cartLink)).toBeVisible();
    }

    async isUserLoggedIn(): Promise<boolean> {
        try {
            await this.page.waitForSelector(this.logoutLink, { timeout: 2000 });
            return true;
        } catch {
            return false;
        }
    }

    async logout(): Promise<void> {
        if (await this.isUserLoggedIn()) {
            await this.page.locator(this.logoutLink).click();
            await this.page.waitForSelector(this.loginLink, { state: 'visible' });
        }
    }
}
