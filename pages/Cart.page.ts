import { Locator, Page } from "@playwright/test";
import { CartItem } from "./CartItem.page";
import { Home } from "./Home.page";
import { ProductDetail } from "./ProductDetail.page";

export class Cart {
    private readonly page: Page;
    private readonly productElement: Locator;
    private readonly productItems: Locator;
    private readonly _totalPrice: Locator;
    private readonly btn_PlaceOrder: Locator;
    private readonly _name: Locator;
    private readonly _country: Locator;
    private readonly _city: Locator;
    private readonly _creditCard: Locator;
    private readonly _month: Locator;
    private readonly _year: Locator;
    private readonly btn_Purchase: Locator;
    private readonly purchaseSuccess: Locator;
    private readonly btn_home: Locator;
    private readonly delete: Locator;

    constructor(page: Page) {
        this.page = page;
        this.productElement = this.page.locator("//h2[text()='Products']");
        this.productItems = this.page.locator("//tr[@class='success']");
        this._totalPrice = this.page.locator("#totalp");
        this.btn_PlaceOrder = this.page.locator("//button[text()='Place Order']");
        this._city = this.page.locator("#city");
        this._country = this.page.locator("#country");
        this._creditCard = this.page.locator("#card");
        this._month = this.page.locator("#month");
        this._year = this.page.locator("#year");
        this._name = this.page.locator("#name");
        this.btn_Purchase = this.page.locator("//button[text()='Purchase']");
        this.purchaseSuccess = this.page.locator("//h2[text()='Thank you for your purchase!']");
        this.btn_home = this.page.locator("//a[text()='Home ']");
        this.delete = this.page.locator("//a[text()='Delete']")
    }
    async isCartVisible() { return await this.productElement.isVisible() };
    async getProductItems() {
        const elements = await this.productItems.all();
        if (elements.length === 0) return [];
        return elements.map((_, i) => new CartItem(this.page, i));
    }
    async getTotalPrice() {
        const totalPrice = await this._totalPrice.textContent();
        return totalPrice ? parseInt(totalPrice.replace(/[^\d.]/g, "")) : 0;
    }
    async clickBtnPlaceOrder() { await this.btn_PlaceOrder.click() };
    async inputName(name: string) { await this._name.fill(name) };
    async inputCity(city: string) { await this._city.fill(city) };
    async inputCountry(country: string) { await this._country.fill(country) };
    async inputCreditCard(card: string) { await this._creditCard.fill(card) };
    async inputMonth(month: string) { await this._month.fill(month) };
    async inputYear(year: string) { await this._year.fill(year) };
    async finishPurchase() { return await this.purchaseSuccess.isVisible() };
    async clickBtnPurchase() { await this.btn_Purchase.click() };
    async clickHome() { await this.btn_home.click() };
    async clickDelete() { await this.delete.click() };
}
