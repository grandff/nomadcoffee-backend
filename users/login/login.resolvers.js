import client from "../../client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default {
	Mutation : {
		login : async(_, {
			username,
			password
		}) => {
			try{
				// 해당 username을 가진 유저가 있는지 확인
				const user = await client.user.findFirst({where : {username}});
				if(!user){
					throw new Error("해당 유저 정보가 존재하지 않습니다. 아이디나 패스워드를 확인해주세요.");
				}
				// 입력받은 password hash 변환
				const hashPassword = await bcrypt.hash(password, 10);

				// username과 password가 일치하는지 확인
				const passwordCheck = await bcrypt.compare(password, user.password);
				if(!passwordCheck){
					throw new Error("해당 유저 정보가 존재하지 않습니다. 아이디나 패스워드를 확인해주세요.");
				}

				// 토큰 생성	
				const token = await jwt.sign({id : user.id}, process.env.SECRET_KEY);
				return {
					ok : true,
					token
				}
			}catch(e){
				return {
					ok : false,
					error : `로그인에 실패했습니다. ${e}`
				}
			}			
		}
	}
}