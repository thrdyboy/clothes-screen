import { Router } from "express";
import { ClothingController } from "../controllers/clothing.controller";

export class RouteClothes {
    private router: Router
    private clothesCont: ClothingController

    constructor() {
        this.router = Router()
        this.clothesCont = new ClothingController()
        this.initializeRoute()
    }

    private initializeRoute(): void {
        this.router.get('/getCustomer', this.clothesCont.getCustomerAll.bind(this.clothesCont))
        this.router.get('/getClothes', this.clothesCont.getClothesAll.bind(this.clothesCont))
        this.router.post('/custom-clothes', this.clothesCont.createCustomClothes.bind(this.clothesCont))
        this.router.post('/itemCart', this.clothesCont.calculatePrice.bind(this.clothesCont))
        this.router.post('/invoice/:cartId', this.clothesCont.makeInvoice.bind(this.clothesCont))
    }

    public getRouter(): Router {
        return this.router
    }
}