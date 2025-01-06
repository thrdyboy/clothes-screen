import { Request, Response } from "express";
import Prisma from "../prisma";
import * as Yup from "yup";
import crypto from "crypto";
import path from "path";
import fs from "fs";
import sharp from "sharp";

export class ClothingController {
    async getCustomerAll(req: Request, res: Response): Promise<void> {
        try {
            const { name, fromOrigin } = req.query
            const filter: any = {}

            if (name && fromOrigin) {
                filter.name = { contains: name as string }
                filter.fromOrigin = { contains: fromOrigin as string }
            }

            const customer = await Prisma.customer.findMany({
                where: filter
            })

            console.log("Customer Data: ", customer)
            res.status(200).json(customer)
        } catch (error) {
            res.status(500).json({ message: "Error, failed to fetch the Customer" })
            console.error("Error on Internal Server: ", error)
        }
    }

    async getClothesAll(req: Request, res: Response): Promise<void> {
        try {
            const { nameClothes, customized } = req.query
            const filter: any = {}

            if (customized !== undefined) {
                if (customized === 'true') {
                    filter.customized = true
                    res.status(400).json({ message: "The Clothes is already Customized" })
                    console.log("The clothes is already Customized")
                } else if (customized === 'false') {
                    filter.customized = false
                } else {
                    res.status(400).json({
                        message: "Invalid value for 'customized'. Use 'true' or 'false'.",
                    })
                }
            }

            if (nameClothes) {
                filter.nameClothes = { contains: nameClothes as string }
            }

            const clothes = await Prisma.clothes.findMany({
                where: {
                    ...filter
                }
            })

            const formattedClothes = clothes.map((clothing) => {
                if (clothing.screenPrinting) {
                    try {
                        clothing.screenPrinting = JSON.parse(clothing.screenPrinting)
                    } catch (error) {
                        console.error("Error through screen Printing: ", error)
                        clothing.screenPrinting = [] as any
                    }
                }
                return clothing
            })

            console.log("Clothes Data: ", formattedClothes)
            res.status(200).json(formattedClothes)
        } catch (error) {
            console.error("Error Fetching the Data: ", error)
            res.status(500).json({ message: 'Error, failed to Fetch the Clothes' })
        }
    }

    async createCustomClothes(req: Request, res: Response): Promise<void> {
        const uploadDirectory = path.join(__dirname, '../upload/customizedClothes')
        try {
            const { id, targetField, selectIndex } = req.body

            const parsedID = parseInt(id, 10)
            if (!parsedID || isNaN(parsedID)) {
                res.status(400).json({ message: 'Valid ID required, must be number' })
                return
            }

            const clothes = await Prisma.clothes.findUnique({
                where: { id: parsedID }
            })

            if (!clothes) {
                res.status(404).json({ message: "Clothes not found" })
            } else if (clothes.customized === true) {
                res.status(400).json({ message: "Clothes are already Customized" })
            }

            if (!['front', 'behind', 'leftSide', 'rightSide'].includes(targetField)) {
                res.status(400).json({ message: "Invalid target field" })
            }

            const targetFieldURL = clothes![targetField as keyof typeof clothes]
            if (!targetFieldURL) {
                res.status(400).json({ message: "Target field URL is invalid" })
            }

            if (!clothes?.screenPrinting) {
                res.status(400).json({ message: "No Screen Printing data Found" })
            }

            const screenPrintingURLs = JSON.parse(clothes?.screenPrinting as string) as string[]
            if (screenPrintingURLs.length === 0) {
                res.status(400).json({ message: "No Screen Printing Images Available" })
            }

            const selectedIndex = parseInt(selectIndex, 10)

            if (
                isNaN(selectedIndex) ||
                selectedIndex < 0 ||
                selectedIndex >= screenPrintingURLs.length
            ) {
                res.status(400).json({ message: 'Invalid index for screen printing' })
                return
            }
            const selectedScreenPrintingURL = screenPrintingURLs[selectedIndex]

            const targetFieldFilePath = path.join(
                __dirname,
                '../upload/clothes',
                path.basename(targetFieldURL)
            )

            if (!fs.existsSync(targetFieldFilePath)) {
                res.status(400).json({ message: "Target field file not found" })
            }

            const screenPrintingFilePath = path.join(
                __dirname,
                '../upload/printScreen',
                path.basename(selectedScreenPrintingURL)
            )

            if (!fs.existsSync(screenPrintingFilePath)) {
                res.status(400).json({ message: 'ScreenPrinting file not found' })
            }

            const newFileName = `${parsedID}-${targetField}-${Date.now()}.png`
            const newFilePath = path.join(uploadDirectory, newFileName)
            const newFileURL = `http://localhost:8000/upload/customizedClothes/${newFileName}`

            if (!fs.existsSync(uploadDirectory)) {
                fs.mkdirSync(uploadDirectory, { recursive: true })
            }

            await sharp(targetFieldFilePath)
                .composite([{ input: screenPrintingFilePath, gravity: 'center' }])
                .toFile(newFilePath)

            const updatedClothes = await Prisma.clothes.update({
                where: { id: parsedID },
                data: {
                    customized: true,
                }
            })

            res.status(200).json({
                message: "Clothes customized Successfully",
                data: {
                    id: parsedID,
                    dataDetails: updatedClothes,
                    fileURL: newFileURL
                }
            })
        } catch (error) {
            console.error("Error updating: ", error)
            res.status(500).json({ message: "Error, failed to update the Clothes" })
        }
    }

    async calculatePrice(req: Request, res: Response): Promise<void> {
        try {
            const priceSchema = Yup.object().shape({
                customerId: Yup.number().positive("Customer ID must be positive").required(),
                clothesId: Yup.number().positive("Clothes ID must be positive").required(),
            })

            await priceSchema.validate(req.body)

            const { customerId, clothesId } = req.body

            const FindCustomer: any = await Prisma.customer.findUnique({
                where: { id: customerId },
            })

            const ClothesCart: any = await Prisma.clothes.findFirst({
                where: {
                    id: clothesId,
                    customized: true,
                },
            })

            if (!FindCustomer || !ClothesCart) {
                res.status(404).json({
                    message: "Customer or Customized Clothes not found.",
                })
            }

            const CountThePrice = ClothesCart.price as any * 1.10

            const priceCalcu = await Prisma.item.create({
                data: {
                    taxprice: CountThePrice,
                    clothes: {
                        connect: {
                            id: ClothesCart.id,
                        },
                    },
                    customer: {
                        connect: {
                            id: FindCustomer.id
                        }
                    }
                },
            })

            res.status(201).json({
                message: "Pricing has been calculated successfully",
                data: priceCalcu
            })
        } catch (error) {
            res.status(500).json({
                message: `Error calculating price`
            })
            console.error("Error on Internal Server:", error)
        }
    }


    async makeInvoice(req: Request, res: Response): Promise<void> {
        try {
            const { cartId } = req.params

            const itemCart = await Prisma.item.findFirst({
                where: { cartId: parseInt(cartId) }
            })

            if (!itemCart) throw new Error("the Order still nothing or invalid input")
            const paymentCode = `INV-${crypto.randomBytes(4).toString("hex").toUpperCase()}-${Date.now()}`

            const getInvoice = await Prisma.invoice.create({
                data: {
                    paymentCode,
                    dateIssued: new Date,
                    item: {
                        connect: {
                            cartId: itemCart?.cartId,
                            customerID: itemCart?.customerID,
                            taxprice: itemCart?.taxprice
                        }
                    }
                }
            })

            res.status(201).json({
                message: 'Invoice created successfully',
                invoice: getInvoice
            })
        } catch (error) {
            res.status(500).json({ message: 'Error, failed to make the Invoice' })
            console.error('Internal Server Error: ', error)
        }
    }
}