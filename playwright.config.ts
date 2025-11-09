import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration for DemoBlaze Test Automation
 * Comprehensive setup with multiple browsers, reporting, and CI/CD support
 * Created by Sathish Kumar - Professional Test Automation Engineer
 */
export default defineConfig({
  testDir: './tests',
  
  /* Timeout settings - optimized for DemoBlaze website performance */
  timeout: 60000,
  expect: {
    timeout: 15000
  },
  
  /* Run tests in files in parallel for faster execution */
  fullyParallel: true,
  
  /* Fail the build on CI if you accidentally left test.only in the source code */
  forbidOnly: !!process.env['CI'],
  
  /* Retry configuration - more retries on CI for stability */
  retries: process.env['CI'] ? 2 : 1,
  
  /* Workers configuration - single worker on CI to avoid resource conflicts */
  workers: process.env['CI'] ? 1 : 2,
  
  /* Reporter configuration - clean and focused reporting */
  reporter: [
    ['line'],
    ['html', { 
      outputFolder: './playwright-report',
      open: 'never'
    }]
  ],

  /* Global test settings */
  use: {
    /* Base URL for all tests */
    baseURL: 'https://www.demoblaze.com',
    
    /* Collect trace on first retry for debugging */
    trace: 'on-first-retry',
    
    /* Screenshot settings */
    screenshot: 'only-on-failure',
    
    /* Video recording for failed tests */
    video: 'retain-on-failure',
    
    /* Network settings optimized for DemoBlaze */
    navigationTimeout: 30000,
    actionTimeout: 20000,
    
    /* Accept downloads */
    acceptDownloads: true,
    
    /* Ignore HTTPS errors for test environments */
    ignoreHTTPSErrors: true,
    
    /* Viewport size for consistent testing */
    viewport: { width: 1280, height: 720 },
    
    /* User agent for test identification */
    userAgent: 'Playwright-Test-Automation-Sathish-Kumar'
  },

  /* Browser projects configuration */
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: ['--disable-dev-shm-usage', '--no-sandbox']
        }
      },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Microsoft Edge */
    {
      name: 'Microsoft Edge',
      use: { 
        ...devices['Desktop Edge'],
        channel: 'msedge'
      },
    }
  ],

  /* Output directory configuration */
  outputDir: './test-results/',
  
  /* Test metadata for reporting */
  metadata: {
    'Test Suite': 'DemoBlaze E-commerce Automation',
    'Author': 'Sathish Kumar',
    'Framework': 'Playwright with TypeScript',
    'Test Environment': process.env['TEST_ENV'] || 'Production',
    'Browser Coverage': 'Chrome, Firefox, Safari, Edge',
    'Execution Date': new Date().toISOString()
  }
});
