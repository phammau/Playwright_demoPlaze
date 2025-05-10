import { expect, Locator, Page } from "@playwright/test";
import { Home } from "./Home.page";

export class ProductDetail {
    private readonly page: Page;
    private readonly image: Locator;
    private readonly name: Locator;
    private readonly price: Locator;
    private readonly description: Locator;
    private readonly btn_home: Locator;
    private readonly btn_addToCart: Locator;
    private readonly btn_cart: Locator;

    constructor(page: Page) {
        this.page = page;
        this.image = this.page.locator("#imgp .item.active img");
        this.name = this.page.locator("h2.name");
        this.price = this.page.locator("//h3[@class='price-container']");
        this.description = this.page.locator("//div[@class='tab-pane fade active in']//p");
        this.btn_home = this.page.locator("//a[text()='Home ']")
        this.btn_addToCart = this.page.locator("//a[text()='Add to cart']");
        this.btn_cart = this.page.locator("#cartur");
    }
    async getName() { return await this.name.textContent() }
    async getImage() { return await this.image.getAttribute("src") }
    async getDescription() {
        const text = await this.description.textContent();
        return text ? text.trim() : "";
    }
    async getPrice() {
        const priceText = await this.price.textContent();
        return priceText ? parseInt(priceText.replace(/[^0-9.]/g, "")) : 0;
    }
    async clickHome() { await this.btn_home.click() }
    async clickAddToCart() { await this.btn_addToCart.click() }
    async clickBtnCart() { await this.btn_cart.click() };
}