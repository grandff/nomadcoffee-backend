import jwt from "jsonwebtoken";
import client from "../client";

// 토큰 값으로 사용자 정보 가져옴
export const getUser = async (token) => {
	try{
		// 토큰 여부 확인
		if(!token){
			return null;
		}
		
		// 사용자 정보 가져오기
		const {id} = await jwt.verify(token, process.env.SECRET_KEY);	// 토큰을 id와 secret_key 조합을 해서 생성했으므로 verify를 통해 id값 추출 가능
		const user = await client.user.findUnique({where : {id}});
		
		if(user){
			return user;
		}else{
			return null;
		}
	}catch(e){
		return e;
	}
}
