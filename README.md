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



## 03 Login, Protect resolvers, see/edit profile
### login
1) jwt를 사용해서 토큰값 생성(npm install jsonwebtoken)
	- secret key는 https://www.lastpass.com/features/password-generator 여기에서 생성된 키 사용
2) 아이디, 패스워드 일치 여부 확인
	- 아이디는 findFirst를 사용해서 확인
	- 패스워드는 findFirst를 통해 리턴된 User 객체의 password 필드와 hash 변환한 입력값을 compare를 통해 비교
3) 패스워드 입력 시 bcrypt를 사용해서 hash 처리한 패스워드와 비교해야함
### Protect Resolvers
1) user.utils.js 파일 생성 후 사용자 정보를 가져오는 함수 생성
	- 토큰을 매개변수로 해서 사용자 정보 가져오기
	- token 변환 작업 실시(여기선 id 값으로 토큰 생성했음)
	- jwt.verify 사용
2) server.js 내용 수정
	- resolvers와 typedefs만 리턴하는 걸 context에 유저 정보와 protect resolver를 같이 리턴시켜줌
3) shard 폴더에 utils.js 생성
	- server에서 보낸 context에 loggedInUser (유저정보) 유무를 확인해서 결과 리턴
	- 쿼리는 그대로 실행되도록 처리
4) 로그인이 필요한 기능의 경우 로그인 여부 파악
### edit profile
1) 패스워드 변경 기능도 추가
	- 패스워드 확인 입력도 추가해야함
	- 입력한 패스워드는 다시 hash 처리
2) avatar url 변경
3) 그외 unique 값 제외하고 변경
4) 로그인한 사용자만 처리가능하도록 처리
	- protect resolver 호출
5) 패스워드, 아바타 url은 데이터가 있을 경우에만 바뀌도록 처리
	- es6의 조건문?인지 아무튼 ... && 조건 잘 사용하기
### see profile
1) 누구든지 조회 가능하도록 query로 제공
2) User를 리턴해주기 위해 User를 정의한 typeDefs 생성