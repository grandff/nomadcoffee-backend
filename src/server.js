require("dotenv").config();
import {ApolloServer} from "apollo-server";
import { typeDefs, resolvers } from './schema';
import {getUser} from "./users/users.utils";
import {protectResolver} from "./shared/shared.utils.js";


const server = new ApolloServer({ 	
	typeDefs,
	resolvers,
	context : async(ctx) => {
		return {
			loggedInUser : await getUser(ctx.req.headers.token),
			protectResolver
		}
	}
});
const PORT = process.env.PORT;

server.listen(PORT).then(() => console.log(`Server is running on http://localhost:${PORT}/`));