import { test as base, expect } from "@playwright/test";
import { Home } from "../pages/Home.page";
import { ProductDetail } from "../pages/ProductDetail.page";
import { Cart } from "../pages/Cart.page";
import { BaseTest } from "./BaseTest.ts";

const test = base.extend<{ home: Home, baseTest: BaseTest }>({
    home: async ({ page }, use) => {
        const home = new Home(page);
        await home.goto();
        await page.waitForTimeout(1000);
        await use(home);
    },
    baseTest: async ({ page }, use) => {
        const baseTest = new BaseTest(page);
        await use(baseTest);
    }
})

test('checkCartPageDisplay', async ({ home, page }) => {
    await home.clickBtnCart();
    const cart = new Cart(page);
    expect(await cart.isCartVisible()).toBeTruthy();
})

test('addProductsFromHomePageAndShowInCart', async ({ home, page }) => {
    test.slow();
    const productItems = await home.getProductItems();
    for (const element of productItems) {
        let expectedName = await element.getName();
        let expectedPrice = await element.getPrice();
        let expectedImage = await element.getImage();

        await element.clickProductNameAndAddToCart();
        await home.clickBtnCart();
        await page.waitForSelector("tr[class='success']");

        const cart = new Cart(page);
        let cartItems = await cart.getProductItems();
        let found = false;
        for (const element of cartItems) {
            let actualName = await element.getName();
            let actualImage = await element.getImage();
            let actualPrice = await element.getPrice();
            if (
                expectedName === actualName &&
                expectedPrice === actualPrice &&
                expectedImage === actualImage
            ) {
                found = true;
                break;
            }
        }
        expect(found).toBe(true);
        await cart.clickHome();
    }
})

test('addProductsFromNextPageAndShowCart', async ({ home, page }) => {
    test.slow();
    await home.clickBtnNext();
    await page.waitForTimeout(1000);
    const productItems = await home.getProductItems();
    for (const element of productItems) {
        await page.waitForLoadState();
        const expectedName = await element.getName();
        const expectedPrice = await element.getPrice();
        const expectedImage = await element.getImage();

        await element.clickProductNameAndAddToCart();
        await home.clickBtnCart();
        await page.waitForSelector("tr[class='success']");

        const cart = new Cart(page);
        const cartItems = await cart.getProductItems();
        let found = false;
        for (const element of cartItems) {
            let actualName = await element.getName();
            let actualImage = await element.getImage();
            let actualPrice = await element.getPrice();
            if (
                actualName === expectedName &&
                actualPrice === expectedPrice &&
                actualName === expectedName
            ) {
                found = true;
                break;
            }
        }
        expect(found).toBe(true);
        await cart.clickHome();
        await page.waitForTimeout(1000);
        await home.clickBtnNext();
        await page.waitForTimeout(1000);
    }
})

test('deleteProductsFromHomePageInCart', async ({ home, page }) => {
    test.slow();
    await home.autoAddToCartFromHomePage();
    let cart = new Cart(page);
    let cartItems = await cart.getProductItems();
    let expectedCount = cartItems.length;

    while (cartItems.length > 0) {
        await cartItems[0].clickBtnDelete();
        await page.waitForTimeout(500);
        expectedCount--;
        cartItems = await new Cart(page).getProductItems();//cap nhat lai danh sach
        const actualCount = cartItems.length;
        expect(actualCount).toEqual(expectedCount);
    }
})

test('deleteProductsFromNextPageInCart', async ({ home, page }) => {
    test.slow();
    await home.clickBtnNext();
    await page.waitForTimeout(2000);
    await home.autoAddToCartNextPage();
    let cart = new Cart(page);
    let cartItems = await cart.getProductItems();
    let expectedCount = cartItems.length;

    while (cartItems.length > 0) {
        await cartItems[0].clickBtnDelete();
        await page.waitForTimeout(1000);
        expectedCount--;
        cartItems = await new Cart(page).getProductItems();
        const actualCount = cartItems.length;
        expect(actualCount).toEqual(expectedCount);
    }
})

test('checkTotalPrice', async ({ home, page }) => {
    test.slow();
    await home.autoAddToCartFromHomePage();
    let cart = new Cart(page);
    let cartItems = await cart.getProductItems();
    const prices = await Promise.all(cartItems.map(item => item.getPrice()));
    let actualTotalPrice = prices.reduce((total, prices) => total + prices, 0);
    const expectedTotalPrice = await cart.getTotalPrice();
    expect(actualTotalPrice).toEqual(expectedTotalPrice);
})

test('checkPurchaseOk', async ({ home, baseTest, page }) => {
    test.slow();
    const cart = new Cart(page);
    await baseTest.autoFill();
    await cart.inputName("Pham Van A");
    await cart.inputCreditCard("11111");
    await cart.clickBtnPurchase();
    await page.waitForTimeout(1000);
    expect(await cart.finishPurchase()).toBeTruthy();
})

test('checkPurchaseFail01', async ({ home, baseTest, page }) => {
    test.slow();
    await baseTest.autoFill();
    let dialogMesage = "";
    const message = page.on('dialog', async dialog => {
        dialogMesage = dialog.message();
    });
    const cart = new Cart(page);
    await cart.clickBtnPurchase();
    expect(dialogMesage).toBe("Please fill out Name and Creditcard.");
})

test('checkPurchaseFail02', async ({ home, baseTest, page }) => {
    test.slow();
    const cart = new Cart(page);
    await baseTest.autoFill();
    await cart.inputName("Pham Van A");
    let dialogMesage = "";
    const message = page.on('dialog', async dialog => {
        dialogMesage = dialog.message();
    });
    await cart.clickBtnPurchase();
    expect(dialogMesage).toBe("Please fill out Name and Creditcard.");
})

test('checkPurchaseFail03', async ({ home, baseTest, page }) => {
    test.slow();
    const cart = new Cart(page);
    await baseTest.autoFill();
    await cart.inputCreditCard("11111");
    let dialogMesage = "";
    const message = page.on('dialog', async dialog => {
        dialogMesage = dialog.message();
    });
    await cart.clickBtnPurchase();
    expect(dialogMesage).toBe("Please fill out Name and Creditcard.");
})


