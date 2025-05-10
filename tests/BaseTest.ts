import { Page } from "@playwright/test";
import { Home } from "../pages/Home.page";
import { ProductDetail } from "../pages/ProductDetail.page";
import { Cart } from "../pages/Cart.page";

export class BaseTest {
    private readonly page: Page;
    constructor(page: Page) {
        this.page = page;
    }
    async getMessageDialog() {
        let dialogMesage = "";
        const dialog = this.page.waitForEvent('dialog');
        dialogMesage = (await dialog).message();
        (await dialog).accept();
        return dialogMesage;
    }
    async autoFill() {
        const home = new Home(this.page);
        //  await this.page.waitForTimeout(1000);
        const productItems = await home.getProductItems();
        const randomIndex = Math.floor(Math.random() * productItems.length)//lay san pham ngau nhien
        await productItems[randomIndex].clickName();

        const productDetail = new ProductDetail(this.page);
        this.page.on('dialog', dialog => dialog.accept());
        await productDetail.clickAddToCart();
        await home.clickBtnCart();
        const cart = new Cart(this.page);
        await cart.clickBtnPlaceOrder();

        await cart.inputCountry("Viet Nam");
        await cart.inputCity("HCM");
        await cart.inputMonth("3");
        await cart.inputYear("2025");
    }

}