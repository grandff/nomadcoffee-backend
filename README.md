# Instaclone Challenge - Nomad Coffee backend

## setup 

### install
- npm install apollo-server@2.21.0
- npm install graphql
- npm install nodemon --save-dev
- npm install --save-dev @babel/core
- npm install @babel/preset-env --save-dev
- npm install @babel/node --save-dev
- npm install prisma --save-dev (이후 npx prisma init)
- postgresql (ubuntu 에서 설치하는 방법 찾아서 설정)
- npm install @prisma/studio
- npm install @prisma/client (설치 후 client.js 생성해서 선언)
- npm install graphql-tools@7.0.4
- npm install dotenv

### postgresql db create
- sudo -i -u postgres
- psql
- CREATE DATABASE DATABASE_NAME;

### touch
- touch README.md
- touch .gitignore
- touch server.js (서버쪽 코딩)
- touch babel.config.json (preset-env 설치 후)
	{
 	   "presets" : ["@babel/preset-env"],
	}
- touch schema.js
- touch client.js

### package json
	{
	...
	"scripts" : { 
			"dev" : "nodemon --exec babel-node server",
			"migrate" : "npx prisma migrate dev --preview-feature",
			"studio" : "npx prisma studio"
		},
	...
	}

### sever.js
require("dotenv").config();
import {ApolloServer} from "apollo-server";
import { typeDefs, resolvers } from './schema';

const server = new ApolloServer({ 	
	typeDefs,
	resolvers
});
const PORT = process.env.PORT;

server.listen(PORT).then(() => console.log(`Server is running on http://localhost:${PORT}/`));

### schema.js
import { loadFilesSync, mergeResolvers, mergeTypeDefs, makeExecutableSchema } from "graphql-tools";

const loadedTypes = loadFilesSync(`${__dirname}/**/*.typeDefs.js`);
const loadedResolvers = loadFilesSync(`${__dirname}/**/*.resolvers.js`);       // glob
// ** -> 모든 폴더, * -> 모든 파일

export const typeDefs = mergeTypeDefs(loadedTypes);
export const resolvers = mergeResolvers(loadedResolvers);

### client.js
import { PrismaClient } from "@prisma/client";
const client = new PrismaClient();
export default client;

### prisma sample
model Sample { 
	id Int @id @default(autoincrement()) 
	title String 
	year Int 
	genre String? 
	createdAt DateTime @default(now()) 
	updatedAt DateTime @updatedAt
}
