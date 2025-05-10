import { Locator, Page } from "@playwright/test";
import { ProductItem } from "./ProductItem.page";
import { ProductDetail } from "./ProductDetail.page";

export class Home {
    private readonly title: Locator;
    private readonly page: Page;
    private readonly productElements: Locator;
    private readonly btn_next: Locator;
    private readonly menuPhone: Locator;
    private readonly menuLaptops: Locator;
    private readonly menuMonitor: Locator;
    private readonly btn_cart: Locator;

    constructor(page: Page) {
        this.page = page;
        this.productElements = this.page.locator("//div[@class='col-lg-4 col-md-6 mb-4']");
        this.title = this.page.locator("#nava");
        this.btn_next = this.page.locator("#next2");
        this.btn_cart = this.page.locator("//a[text()='Cart']")
        this.menuPhone = this.page.locator("//a[text()='Phones']");
        this.menuLaptops = this.page.locator("//a[text()='Laptops']");
        this.menuMonitor = this.page.locator("//a[text()='Monitors']");
    }
    async goto() { await this.page.goto("/") }
    isDisPlayOk() { return this.title.isVisible() };
    async getProductItems() {
        const elements = await this.productElements.all();
        if (elements.length === 0) return [];
        return elements.map((_, i) => new ProductItem(this.page, i));
    }
    async clickBtnNext() { await this.btn_next.click() }
    async clickMenuPhone() { await this.menuPhone.click() };
    async isDisPlayMenuPhones() { return this.menuPhone.isVisible() };
    async clickMenuLaptops() { await this.menuLaptops.click() };
    async clickMenuMonitors() { await this.menuMonitor.click() };
    async clickBtnCart() { await this.btn_cart.click() };
    async autoAddToCartFromHomePage() {
        const home = new Home(this.page);
        const productItems = await home.getProductItems();
        for (let i = 0; i < productItems.length; i++) {
            const element = productItems[i];
            await element.clickProductNameAndAddToCart();
            const productDetail = new ProductDetail(this.page);
            if (i < productItems.length - 1) {
                await this.page.waitForTimeout(500);
                await productDetail.clickHome();
                await this.page.waitForTimeout(500);
            }
        }
        await home.clickBtnCart();
    }
    async autoAddToCartNextPage() {
        await this.page.waitForTimeout(1000);
        const home = new Home(this.page);
        const productItems = await home.getProductItems();
        for (let i = 0; i < productItems.length; i++) {
            const element = productItems[i];
            await element.clickProductNameAndAddToCart();
            const productDetail = new ProductDetail(this.page);
            if (i < productItems.length - 1) {
                await productDetail.clickHome();
                await this.page.waitForTimeout(500);
                await home.clickBtnNext();
                await this.page.waitForTimeout(1000);
            }
        }
        await home.clickBtnCart();
    }

}

