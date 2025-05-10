import { Locator, Page } from "@playwright/test";

export class CartItem {
    private readonly page: Page;
    private readonly name: Locator;
    private readonly Image: Locator;
    private readonly _price: Locator;
    private readonly btnDelete: Locator;
    constructor(page: Page, index: number) {
        this.page = page;
        index++;
        this.name = this.page.locator("//tr[@class='success'][" + index + "] //td[2]");
        this.Image = this.page.locator("//tr[@class='success'][" + index + "] //img");
        this._price = this.page.locator("//tr[@class='success'][" + index + "] //td[3]");
        this.btnDelete = this.page.locator("//tr[@class='success'][" + index + "]//a[text()='Delete']")
    }
    async getName() { return await this.name.textContent() };
    async getImage() { return await this.Image.getAttribute("src") };
    async getPrice() {
        const price = await this._price.textContent();
        return price ? parseInt(price.replace(/[^0-9.]+/g, "")) : 0
    }
    async clickBtnDelete() { await this.btnDelete.click() }
}