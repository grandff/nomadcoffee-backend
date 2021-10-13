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



## 04 Follow/Unfollow, seeUser with seeFollowing, seeFollowers, searchUsers
### Follow
1) connect를 사용해서 두 사용자간 연결
	- connect는 unique한 필드에만 사용 가능함
### UnFollow
1) unconnect를 사용해서 두 사용자간 연결 해제
### seeUser with seeFollowing, seeFollowers
1) seeUser 안에 following, followers 둘다 확인할 수 있도록 정의
2) pagination 사용
	- page int를 필수로 주고 받아야함
	- take와 skip을 활용
3) 전체 팔로워, 팔로잉 수 리턴
	- Math.ceil를 사용해서 올림한 값 리턴
### searchUsers
1) pagination 사용
	- page, take, skip 사용
2) 대소문자 구분 없이 검색하기 위해 lowercase를 사용
3) 해당 문자 포함을 체크하기 위해 contains 사용



## 05 createCoffeeShop, seeCoffeeShops, seeCoffeeShop, seeCategory, seeCategories, editCoffeeShop
### createCoffeeShop
1) 기존에 photo 하나만 올리던걸 coffee shop으로 묶어서 하는거 같은데욤?
2) 이전에 hashtags가 category로 들어간거임
3) 가장 먼저 model 생성 후 shops.typeDefs.js 정의
4) caption 컬럼에 shop에 대한 설명 적기
	- hashtag 추출하는것처럼 # 뒤에 있는 데이터를 category로 저장하기
5) file url 가져오기
	- static 쓰지말고 바로 aws 연동시키기(npm install aws-sdk)
6) categories와 photos 같이 업로드
	- relation 으로 서로 연결
	- categories 는 connectOrCreate로 해시태그가 있을때만 등록
	- connectOrCreate는 unique 필드여야함
	- photos는 create로 연결해서 등록
### seeCoffeeShops
1) 전체 coffeeshop list 제공
	- pagination 활용
2) include 사용..?
	- 이거 front 에서 include 사용하는거 아니였나.. 일단 데이터 조회를 위해 include user photo category 해놨음
### seeCoffeeShop
1) id 값으로 해당 coffeeshop 정보 확인
### seeCategory
1) 해당 카테고리에 해당하는 coffeeshop list return
	- pagination 활용
### seeCategories
1) 전체 카테고리를 보여줌
	- pagination 활용
2) 각 카테고리별 포함하고 있는 상점 갯수도 같이 리턴
	- cateogry resolvers 생성해서 count 추가 
### editCoffeeShop
1) coffee shop 정보 수정
	- name을 제외한 나머지 값 수정
	- categoires 의 connect를 제거하고 새로 연결하는 작업이 필요함
	
	
## 06 heroku
### Build Server
1) 실제 서버엔 nodemon이 필요 없고 babel-node를 쓰면 용량도 크고 메모리를 많이 차지해서 babel cli를 사용해야함
	- npm install @babel/cli --dev-only
2) src 폴더를 만들어서 모든 파일을 해당 폴더에 넣기
	- package의 dev 명령어에 server 경로를 src/server로 변경
3) build, start 명령어 추가
	- "build": "babel src --out-dir build"
	- "start": "node build/server"
	- npm run build로 build 후에 start 명령어로 실행되는지 확인 필요
	- .gitignore에 build 폴더 추가
4) start 명령어 시 필요한 regenerator-runtime 설치
	- npm install --save-dev @babel/plugin-transform-runtime
	- babel.config.json에 "plugins" : ["@babel/plugin-transform-runtime"] 추가하기
### Deploy Heroku
1) deploy는 github 방식으로 추가하기
	- create new app 후 github 클릭 해서 repo하고 연결
2) .env 파일에 추가한 변수들을 heroku에 추가하기
	- settings의 Config vars로 이동해서 입력
	- db url, port는 입력할 필요 없음
3) prisma 사용을 위한 addon 추가
	- heroku postgres addons 설치
4) prisma migrate 사용을 위해 Procfile 추가
	- release: npx prisma migrate deploy
	- web: npm start
	- 위 두줄 추가하기
### 추가 작업
1) 파일 업로드를 위해 cors 적용
2) apollo express server로 교체
	- 현재 apollo server를 2. 버전대로 해놨기때문에 똑같이 2. 버전대로 해놨음