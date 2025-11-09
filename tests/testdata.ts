// Test user data - customized for my testing approach
export const testUsers = {
    validUser: {
        username: 'sathish_test_' + Date.now(),
        password: 'MySecure@123'
    },
    existingUser: {
        username: 'sathish_demo_user',
        password: 'Demo@Pass456'
    },
    invalidUser: {
        username: 'invalid_user',
        password: 'wrong_password'
    }
};

// Product test data - Updated with exact DemoBlaze product names
export const testProducts = {
    phone: 'Samsung galaxy s6',
    laptop: 'Sony vaio i5', 
    monitor: 'ASUS Full HD',
    laptop2: 'MacBook air',
    phone2: 'Nokia lumia 1520'
};

// Contact form test data - My approach to cover different validation scenarios
export const contactFormData = {
    valid: {
        email: 'sathish.qa.testing@gmail.com',
        name: 'Sathish Kumar',
        message: 'Testing contact functionality - automated test execution for quality assurance validation.'
    },
    invalid: {
        email: 'invalid-email-format',
        name: '',
        message: ''
    },
    // Additional edge cases I want to test based on my experience
    edgeCases: {
        longMessage: {
            email: 'test.long@example.com',
            name: 'Test User',
            message: 'A'.repeat(500) // Testing character limits
        },
        specialCharacters: {
            email: 'special+test@domain-name.co.uk',
            name: 'Test-User_123',
            message: 'Testing special chars: !@#$%^&*()_+-=[]{}|;:,.<>?'
        }
    }
};

// Order form test data - My comprehensive approach to payment testing
export const orderData = {
    customer: {
        name: 'Sathish Kumar',
        country: 'India',
        city: 'Bangalore',
        creditCard: '4111111111111111', // Standard Visa test card
        month: '03',
        year: '2026'
    },
    invalidCustomer: {
        name: '',
        country: '',
        city: '',
        creditCard: '1234', // Intentionally invalid
        month: '13', // Invalid month
        year: '2020' // Past year
    },
    // My additional test scenarios for robust validation
    testCards: {
        masterCard: {
            name: 'Test MasterCard User',
            country: 'United States',
            city: 'San Francisco',
            creditCard: '5555555555554444',
            month: '06',
            year: '2027'
        },
        expiredCard: {
            name: 'Expired Card Test',
            country: 'Canada',
            city: 'Toronto',
            creditCard: '4111111111111111',
            month: '01',
            year: '2023' // Expired
        }
    }
};

// Test environment configuration
export const config = {
    baseUrl: 'https://www.demoblaze.com/',
    screenshotPath: './test-results/screenshots/',
    timeout: {
        short: 5000,
        medium: 10000,
        long: 30000
    }
};

// Test environment timeouts
export const timeouts = {
    short: 5000,
    medium: 10000,
    long: 30000
};

// Categories for product filtering
export const categories = {
    phones: 'Phones',
    laptops: 'Laptops',
    monitors: 'Monitors'
} as const;

// My custom test data generators - Ensures unique data for parallel execution
// Based on my experience, dynamic data prevents test conflicts in CI/CD pipelines
export const generateRandomUser = () => ({
    username: `sathish_auto_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    password: 'MySecure@Pass123!' // Following strong password policy I prefer
});

export const generateRandomEmail = () => {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(7);
    return `sathish.qa.${timestamp}.${randomId}@testautomation.dev`;
};

export const generateRandomContactData = () => {
    const uniqueId = Math.random().toString(36).substring(7);
    return {
        email: generateRandomEmail(),
        name: `QA Tester ${uniqueId.toUpperCase()}`,
        message: `Automated test message - Execution ID: ${Date.now()} | Generated: ${new Date().toISOString()}`
    };
};

// My utility function for test data validation
export const validateTestData = (data: any) => {
    // Custom validation logic I developed for data integrity
    return data && typeof data === 'object' && Object.keys(data).length > 0;
};
