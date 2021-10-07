require("dotenv").config();
import {ApolloServer} from "apollo-server";
import { typeDefs, resolvers } from './schema';
import {getUser} from "./users/users.utils";
import {protectResolver} from "./shared/shared.utils.js";


const server = new ApolloServer({ 	
	typeDefs,
	resolvers,
	playground : true,		// production 모드에서도 /graphql 을 실행할 수 있도록 처리(확인 용도로만 사용하고 주석 처리하기)
	introspection : true,	// production 모드에서도 query 실행 가능하도록 해줌
	context : async(ctx) => {
		return {
			loggedInUser : await getUser(ctx.req.headers.token),
			protectResolver
		}
	}
});
const PORT = process.env.PORT;

server.listen(PORT).then(() => console.log(`Server is running on http://localhost:${PORT}/`));