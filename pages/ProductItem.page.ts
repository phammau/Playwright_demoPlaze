import { Locator, Page } from "@playwright/test";
import { ProductDetail } from "./ProductDetail.page";

export class ProductItem {
    private readonly page: Page;
    private readonly image: Locator;
    private readonly name: Locator;
    private readonly price: Locator;
    private readonly description: Locator;
    
    constructor(page: Page, index: number) {
        index++;
        this.page = page;
        this.image = this.page.locator("//div[@class='col-lg-4 col-md-6 mb-4'][" + index + "]//img[@class='card-img-top img-fluid']");
        this.name = this.page.locator("//div[@class='col-lg-4 col-md-6 mb-4'][" + index + "]//a[@class='hrefch']");
        this.price = this.page.locator("//div[@class='col-lg-4 col-md-6 mb-4'][" + index + "]//h5");
        this.description = this.page.locator("//div[@class='col-lg-4 col-md-6 mb-4'][" + index + "]//p[@id='article']");
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
    async clickName() { await this.name.click() }
    async clickProductNameAndAddToCart() {
        await this.clickName()
        const productDetail = new ProductDetail(this.page);
        await productDetail.clickAddToCart();
        const dialog = this.page.waitForEvent('dialog');
        (await dialog).accept();
    }
}