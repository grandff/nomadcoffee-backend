require("dotenv").config();
import { typeDefs, resolvers } from './schema';
import {getUser} from "./users/users.utils";
import {protectResolver} from "./shared/shared.utils.js";
import http from 'http';
import logger from 'morgan';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';

const cors = require("cors");

const apollo = new ApolloServer({ 		
	resolvers,
	typeDefs,
	//playground : true,		// production 모드에서도 /graphql 을 실행할 수 있도록 처리(확인 용도로만 사용하고 주석 처리하기)
	//introspection : true,	// production 모드에서도 query 실행 가능하도록 해줌
	context : async(ctx) => {
		return {
			loggedInUser : await getUser(ctx.req.headers.token),
			protectResolver
		}
	}
});

const PORT = process.env.PORT;

// set express server
const app = express();
app.use(cors());
app.use(logger('tiny')); // set logger. 'combined','tiny','dev','common'
apollo.applyMiddleware({ app }); // logger 다음줄에 applyMiddleware에 써야함

// create http server
const httpServer = http.createServer(app);
apollo.installSubscriptionHandlers(httpServer); // ws 소켓 처리

httpServer.listen(PORT, () => {
  console.log(`Server is running on https://localhost:${PORT}/`);
});