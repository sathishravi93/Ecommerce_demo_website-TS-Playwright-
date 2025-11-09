import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

/**
 * AuthenticationPage Class - Clean & Simple Format
 * Elements at top, wrapper methods below
 * @author Sathish Kumar
 */
export class AuthenticationPage {
    readonly page: Page;
    
    // Login Modal Elements
    private loginModal = '#logInModal';
    private loginUsernameInput = '#loginusername';
    private loginPasswordInput = '#loginpassword';
    private loginButton = 'button[onclick="logIn()"]';
    private loginCloseButton = '#logInModal .close, #logInModal button[data-dismiss="modal"]';
    
    // Sign Up Modal Elements
    private signUpModal = '#signInModal';
    private signUpUsernameInput = '#sign-username';
    private signUpPasswordInput = '#sign-password';
    private signUpButton = 'button[onclick="register()"]';
    private signUpCloseButton = '#signInModal .close, #signInModal button[data-dismiss="modal"]';
    
    // Navigation Elements
    private welcomeMessage = '#nameofuser';
    private logoutButton = '#logout2';
    private loginLink = '#login2';
    private signUpLink = '#signin2';
    
    // Alert Elements
    private alertMessage = '.alert';
    
    constructor(page: Page) {
        this.page = page;
    }

    // Modal Verification Wrapper Methods
    async waitForLoginModal(): Promise<void> {
        await expect(this.page.locator(this.loginModal)).toBeVisible();
        await expect(this.page.locator(this.loginUsernameInput)).toBeVisible();
    }

    async waitForSignUpModal(): Promise<void> {
        await expect(this.page.locator(this.signUpModal)).toBeVisible();
        await expect(this.page.locator(this.signUpUsernameInput)).toBeVisible();
    }

    // Login Wrapper Methods
    async login(username: string, password: string): Promise<void> {
        await this.waitForLoginModal();
        
        await this.page.locator(this.loginUsernameInput).fill(username);
        await this.page.locator(this.loginPasswordInput).fill(password);
        await this.page.locator(this.loginButton).click();
        
        await expect(this.page.locator(this.loginModal)).toBeHidden();
        
        try {
            await expect(this.page.locator(this.welcomeMessage)).toBeVisible({ timeout: 5000 });
        } catch {
            // Login might have failed - handled in test verification
        }
    }

    async signUp(username: string, password: string): Promise<boolean> {
        await this.waitForSignUpModal();
        
        await this.page.locator(this.signUpUsernameInput).fill(username);
        await this.page.locator(this.signUpPasswordInput).fill(password);
        
        let alertMessage = '';
        this.page.once('dialog', async dialog => {
            alertMessage = dialog.message();
            await dialog.accept();
        });
        
        await this.page.locator(this.signUpButton).click();
        await this.page.waitForTimeout(2000);
        
        const isSuccess = alertMessage.includes('Sign up successful');
        
        if (isSuccess) {
            await expect(this.page.locator(this.signUpModal)).toBeHidden();
        }
        
        return isSuccess;
    }

    // Modal Control Wrapper Methods
    async closeLoginModal(): Promise<void> {
        await this.page.locator(this.loginCloseButton).first().click();
        await expect(this.page.locator(this.loginModal)).toBeHidden();
    }

    async closeSignUpModal(): Promise<void> {
        await this.page.locator(this.signUpCloseButton).first().click();
        await expect(this.page.locator(this.signUpModal)).toBeHidden();
    }

    // Session Management Wrapper Methods
    async logout(): Promise<void> {
        await expect(this.page.locator(this.logoutButton)).toBeVisible();
        await this.page.locator(this.logoutButton).click();
        
        await expect(this.page.locator(this.welcomeMessage)).toBeHidden();
        await expect(this.page.locator(this.loginLink)).toBeVisible();
    }

    async isLoggedIn(): Promise<boolean> {
        try {
            await expect(this.page.locator(this.welcomeMessage)).toBeVisible({ timeout: 2000 });
            return true;
        } catch {
            return false;
        }
    }

    async getWelcomeMessage(): Promise<string> {
        if (await this.isLoggedIn()) {
            return await this.page.locator(this.welcomeMessage).textContent() || '';
        }
        return '';
    }

    async getLoggedInUsername(): Promise<string> {
        const welcomeText = await this.getWelcomeMessage();
        return welcomeText.replace('Welcome ', '').trim();
    }

    // Verification Wrapper Methods
    async verifyLoginSuccess(expectedUsername: string): Promise<void> {
        await expect(this.page.locator(this.welcomeMessage)).toBeVisible();
        const welcomeText = await this.getWelcomeMessage();
        expect(welcomeText).toContain(expectedUsername);
        await expect(this.page.locator(this.logoutButton)).toBeVisible();
    }

    async verifyLoggedOut(): Promise<void> {
        await expect(this.page.locator(this.welcomeMessage)).toBeHidden();
        await expect(this.page.locator(this.logoutButton)).toBeHidden();
        await expect(this.page.locator(this.loginLink)).toBeVisible();
    }

    // Error Handling Wrapper Methods
    async attemptLoginWithInvalidCredentials(username: string, password: string): Promise<string> {
        await this.waitForLoginModal();
        
        await this.page.locator(this.loginUsernameInput).fill(username);
        await this.page.locator(this.loginPasswordInput).fill(password);
        
        let alertMessage = '';
        this.page.once('dialog', async dialog => {
            alertMessage = dialog.message();
            await dialog.accept();
        });
        
        await this.page.locator(this.loginButton).click();
        await this.page.waitForTimeout(2000);
        
        return alertMessage;
    }

    async attemptSignUpWithExistingUser(username: string, password: string): Promise<string> {
        await this.waitForSignUpModal();
        
        await this.page.locator(this.signUpUsernameInput).fill(username);
        await this.page.locator(this.signUpPasswordInput).fill(password);
        
        let alertMessage = '';
        this.page.once('dialog', async dialog => {
            alertMessage = dialog.message();
            await dialog.accept();
        });
        
        await this.page.locator(this.signUpButton).click();
        await this.page.waitForTimeout(2000);
        
        return alertMessage;
    }
}