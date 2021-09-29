import client from "../../client";
import bcrypt from "bcrypt";
import {emailCheck, passwordCheck} from "../../constants";
// bcrypt 들어가야함 hash

export default {
	Mutation : {
		createAccount : async(_, {
			username,
			email,
			name,
			location,
			password
		}) => {
			try{
				// username, email이 존재하는지 확인
				const existUser = await client.user.findFirst({
					where : {
						OR : [
							{
								username
							},
							{
								email
							}
						]
					}
				});
				if(existUser){
					throw new Error("이미 있는 사용자이름 또는 이메일 입니다. 다시 확인해주세요.");
				}
				
				// 입력한 email이 email 형식이 맞는 확인				
				if(email.search(emailCheck) === -1){
					throw new Error("올바른 이메일 형식이 아닙니다. 이메일을 다시 입력해주세요.");
				}
				
				// 패스워드 설정 기준 준수 확인(최소 6자리 이상, 영문자 및 특수문자 포함)
				if(password.search(passwordCheck) === -1){
					throw new Error("올바른 패스워드 형식이 아닙니다. 패스워드 생성 규칙을 준수해주세요.");
				}
				
				// hash password 생성
				const hashPassword = await bcrypt.hash(password, 10);				
				
				// create data
				await client.user.create({
					data : {
						username,
						email,
						name,
						location,
						password : hashPassword
					}
				});
				
				return {
					ok : true
				}
			}catch(e){
				return {
					ok : false,
					error : `해당 계정을 만들 수 없습니다. ${e}`
				}
			}
		}
	}
}