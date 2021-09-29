# Instaclone Challenge - Nomad Coffee backend

## 01 setup 

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



## 02 Create Account
### schema.prisma
1) 필수로 들어가는 항목 구분해서 model 생성
### createAccount.typeDefs.js
1) model에 맞게 typeDefs 설정
2) 공통 mutation response 정보를 가진 shared/shared.typeDefs.js 생성
### createAccount.resolvers.js
1) hash password 생성
	- bcrypt 사용(npm install bcrypt)
	- 전달받은 password를 bcrypt.hash를 사용해서 변환
2) username, email 중복 확인
3) email 형식 준수 여부 확인
4) password 형식 준수 여부 확인
5) data 생성