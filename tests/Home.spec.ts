import { test as base, expect } from '@playwright/test';
import { Home } from '../pages/Home.page';
import { ProductDetail } from '../pages/ProductDetail.page';
import { readFileSync } from 'fs';

const test = base.extend<{ home: Home }>({
  home: async ({ page }, use) => {
    const home = new Home(page);
    await home.goto();
    await page.waitForTimeout(1000);
    await use(home);
  }
})

test('test01', async ({ home, page }) => {
  expect(await home.isDisPlayOk()).toBeTruthy();
})

test('testClickProductItem', async ({ home, page }) => {
  test.slow();
  await page.waitForTimeout(2000);
  const productItems = await home.getProductItems();
  for (const element of productItems) {
    const expectedName = await element.getName();
    const expectedPrice = await element.getPrice();
    const expectedDescription = await element.getDescription();
    const expectedImage = await element.getImage();

    await element.clickName();
    const prod = new ProductDetail(page);
    const actualName = await prod.getName();
    const actualImage = await prod.getImage();
    const actualDescription = await prod.getDescription();
    const actualPrice = await prod.getPrice();

    expect(expectedName).toEqual(actualName);
    expect(expectedImage).toEqual(actualImage);
    expect(expectedDescription).toEqual(actualDescription);
    expect(expectedPrice).toEqual(actualPrice);
    await prod.clickHome();
  }
})

test('testClickProductItemNextPage', async ({ home, page }) => {
  test.slow();
  await home.clickBtnNext();
  await page.waitForTimeout(1000);
  const productItems = await home.getProductItems();
  for (const element of productItems) {
    const expectedName = await element.getName();
    const expectedPrice = await element.getPrice();
    const expectedDescription = await element.getDescription();
    const expectedImage = await element.getImage();

    await element.clickName();
    const prod = new ProductDetail(page);
    const actualName = await prod.getName();
    const actualImage = await prod.getImage();
    const actualDescription = await prod.getDescription();
    const actualPrice = await prod.getPrice();

    expect(expectedName).toEqual(actualName);
    expect(expectedImage).toEqual(actualImage);
    expect(expectedDescription).toEqual(actualDescription);
    expect(expectedPrice).toEqual(actualPrice);

    await prod.clickHome();
    const home = new Home(page);
    await home.clickBtnNext();
  }
})

test('selectPhoneCategory', async ({ home, page }) => {
  const expectedData = JSON.parse(readFileSync("productName.json", "utf-8"));
  const expected = expectedData["Phone"]
  await home.clickMenuPhone();
  await page.waitForTimeout(1000);
  const productItems = await home.getProductItems();
  const actual = await Promise.all(productItems.map(async (item) => item.getName()));
  await page.waitForTimeout(1000);
  expect(actual).toEqual(expected);
})

test('selectLaptopsCategory', async ({ home, page }) => {
  const expectedData = JSON.parse(readFileSync("productName.json", "utf-8"))
  const expected = expectedData["Laptops"];
  await home.clickMenuLaptops();
  await page.waitForTimeout(1000);
  const productItems = await home.getProductItems();
  const actual = await Promise.all(productItems.map(async (item) => item.getName()));
  expect(actual).toEqual(expected);
})

test('selectMonitorCategory', async ({ home, page }) => {
  const expectedData = JSON.parse(readFileSync("productName.json", "utf-8"));
  const expected = expectedData["Monitors"];
  await home.clickMenuMonitors();
  await page.waitForTimeout(1000);
  const productItems = await home.getProductItems();
  const actual = await Promise.all(productItems.map(async (item) => item.getName()));
  await page.waitForTimeout(1000);
  expect(actual).toEqual(expected);
})