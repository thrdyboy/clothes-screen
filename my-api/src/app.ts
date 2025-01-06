import express, {
    json,
    urlencoded,
    Express,
    Request,
    Response,
    NextFunction
} from 'express'
import cors from 'cors'
import { port } from './config'
import { RouteClothes } from './routers/clothing.router'

export default class App {
    private app: Express

    constructor() {
        this.app = express()
        this.configure()
        this.routes()
        this.HandleError()
    }

    private configure(): void {
        this.app.use(cors({ origin: 'http://localhost:3000' }))
        this.app.use(json())
        this.app.use(urlencoded({ extended: true }))
        this.app.use('/upload', express.static('upload'))
    }

    private HandleError(): void {
        this.app.use((req: Request, res: Response, next: NextFunction) => {
            if (req.path.includes('/api/')) {
                res.status(404).send('Not Found !')
            } else {
                next()
            }
        })

        this.app.use(
            (err: Error, req: Request, res: Response, next: NextFunction) => {
                if (req.path.includes('/api/')) {
                    console.error('Error : ', err.stack);
                    res.status(500).send('Error !');
                } else {
                    next();
                }
            },
        )
    }

    private routes() {
        const clothesRouter = new RouteClothes()
        this.app.use('/api/clothes', clothesRouter.getRouter())
    }

    public start(): void {
        this.app.listen(port, () => {
            console.log(`[API] local: http://localhost:${port}`)
        })
    }
}