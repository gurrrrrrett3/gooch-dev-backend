import express from 'express';
import indexRouter from "./routers/mainRouter";

const App = express();

App.use("/", indexRouter);

export default class Website {

    public static Start() {
        App.listen(80, () => {
            console.log("Website started on port 80");
        })
    }

    public static Stop() {
        console.log("Website cannot be stopped");
    }

}