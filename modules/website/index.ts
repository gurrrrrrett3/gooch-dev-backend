import express from 'express';
import Logger from '../util/logger';
import indexRouter from "./routers/mainRouter";

const App = express();

App.use(express.json());
App.use("/", indexRouter);


export default class Website {

    public static Start() {
        App.listen(8080, () => {
            Logger.log("Website started on port 80");
        })
    }

    public static Stop() {
        Logger.log("Website cannot be stopped");
    }

}