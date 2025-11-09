import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

export interface ContactFormData {
    email: string;
    name: string;
    message: string;
}

/**
 * ContactPage Class - Clean & Simple Format
 * Elements at top, wrapper methods below
 * @author Sathish Kumar
 */
export class ContactPage {
    readonly page: Page;
    
    // Contact Modal Elements
    private contactModal = '#exampleModal';
    private emailInput = '#recipient-email';
    private nameInput = '#recipient-name';
    private messageInput = '#message-text';
    private sendMessageButton = 'button[onclick="send()"]';
    private closeButton = '#exampleModal .close, #exampleModal button[data-dismiss="modal"]';
    
    // Navigation Elements
    private contactLink = 'a[data-target="#exampleModal"]';
    
    constructor(page: Page) {
        this.page = page;
    }

    // Modal Verification Wrapper Methods
    async waitForContactModal(): Promise<void> {
        await expect(this.page.locator(this.contactModal)).toBeVisible();
        await expect(this.page.locator(this.emailInput)).toBeVisible();
    }

    // Form Interaction Wrapper Methods
    async fillContactForm(formData: ContactFormData): Promise<void> {
        await this.waitForContactModal();
        
        await this.page.locator(this.emailInput).fill(formData.email);
        await this.page.locator(this.nameInput).fill(formData.name);
        await this.page.locator(this.messageInput).fill(formData.message);
    }

    async sendMessage(formData: ContactFormData): Promise<string> {
        await this.fillContactForm(formData);
        
        let alertMessage = '';
        this.page.once('dialog', async dialog => {
            alertMessage = dialog.message();
            await dialog.accept();
        });
        
        await this.page.locator(this.sendMessageButton).click();
        await this.page.waitForTimeout(2000);
        
        return alertMessage;
    }

    // Modal Control Wrapper Methods
    async closeContactModal(): Promise<void> {
        await this.page.locator(this.closeButton).first().click();
        await expect(this.page.locator(this.contactModal)).toBeHidden();
    }

    async clearForm(): Promise<void> {
        await this.page.locator(this.emailInput).clear();
        await this.page.locator(this.nameInput).clear();
        await this.page.locator(this.messageInput).clear();
    }

    // Form Data Wrapper Methods
    async getFormData(): Promise<ContactFormData> {
        return {
            email: await this.page.locator(this.emailInput).inputValue(),
            name: await this.page.locator(this.nameInput).inputValue(),
            message: await this.page.locator(this.messageInput).inputValue()
        };
    }

    async verifyFormFields(): Promise<void> {
        await expect(this.page.locator(this.emailInput)).toBeVisible();
        await expect(this.page.locator(this.nameInput)).toBeVisible();
        await expect(this.page.locator(this.messageInput)).toBeVisible();
        await expect(this.page.locator(this.sendMessageButton)).toBeVisible();
    }

    async isFormEmpty(): Promise<boolean> {
        const formData = await this.getFormData();
        return !formData.email && !formData.name && !formData.message;
    }

    // Form Testing Wrapper Methods
    async sendEmptyForm(): Promise<string> {
        await this.waitForContactModal();
        await this.clearForm();
        
        let alertMessage = '';
        this.page.once('dialog', async dialog => {
            alertMessage = dialog.message();
            await dialog.accept();
        });
        
        await this.page.locator(this.sendMessageButton).click();
        await this.page.waitForTimeout(2000);
        
        return alertMessage;
    }

    async sendPartialForm(formData: Partial<ContactFormData>): Promise<string> {
        await this.waitForContactModal();
        await this.clearForm();
        
        if (formData.email) await this.page.locator(this.emailInput).fill(formData.email);
        if (formData.name) await this.page.locator(this.nameInput).fill(formData.name);
        if (formData.message) await this.page.locator(this.messageInput).fill(formData.message);
        
        let alertMessage = '';
        this.page.once('dialog', async dialog => {
            alertMessage = dialog.message();
            await dialog.accept();
        });
        
        await this.page.locator(this.sendMessageButton).click();
        await this.page.waitForTimeout(2000);
        
        return alertMessage;
    }

    // Validation Wrapper Methods
    async verifyModalTitle(): Promise<string> {
        const modalTitle = this.page.locator('#exampleModal .modal-title');
        await expect(modalTitle).toBeVisible();
        return await modalTitle.textContent() || '';
    }

    async verifyFormValidation(): Promise<{ isValid: boolean, errors: string[] }> {
        const errors: string[] = [];
        let isValid = true;
        
        const email = await this.page.locator(this.emailInput).inputValue();
        const name = await this.page.locator(this.nameInput).inputValue();
        const message = await this.page.locator(this.messageInput).inputValue();
        
        if (!email) {
            errors.push('Email is required');
            isValid = false;
        }
        
        if (!name) {
            errors.push('Name is required');
            isValid = false;
        }
        
        if (!message) {
            errors.push('Message is required');
            isValid = false;
        }
        
        if (email && !email.includes('@')) {
            errors.push('Invalid email format');
            isValid = false;
        }
        
        return { isValid, errors };
    }
}