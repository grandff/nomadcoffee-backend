import client from "../../client";
import {protectResolver} from "../../shared/shared.utils";
import bcrypt from 'bcrypt';
import {passwordCheck as passwordReg} from "../../constants";

export default {
	Mutation : {
		editProfile : protectResolver(async(_, {
			// params
			name,
			location,
			password,
			passwordCheck,
			avatarUrl
		},{
			// context(login token)
			loggedInUser
		})=> {
			try{				
				let avatar;		// avatarUrl은 아마존 s3 적용전까진 그냥 일반 string 값으로 놔둬야할듯..?
				let hashPassword;	// hash password
				
				// password 입력값 확인
				if(password){
					if(!passwordCheck)	throw new Error("패스워드 확인값을 입력해주세요.");
					else{
						if(passwordCheck !== password) throw new Error("패스워드 확인값이 일치하지 않습니다.");	
						else{
							// 패스워드 설정 기준 준수 확인(최소 6자리 이상, 영문자 및 특수문자 포함)
							if(password.search(passwordReg) === -1){
								throw new Error("올바른 패스워드 형식이 아닙니다. 패스워드 생성 규칙을 준수해주세요.");
							}
						}
					}
					
					// password hash
					hashPassword = await bcrypt.hash(password, 10);
				}
								
				// data update
				const updateUser = await client.user.update({
					where : {
						id : loggedInUser.id
					},
					data : {
						name,
						location,
						...(password && {password : hashPassword}),
						...(avatarUrl && {avatarUrl : avatar})
					}
				});
				
				// update result check
				if(updateUser.id){
					return {
						ok : true
					}	
				}else{
					return {
						ok : false,
						error : "프로필 정보 변경에 실패했습니다."
					}
				}												
			}catch(e){
				return {
					ok : false,
					error : `프로필 정보 변경을 할 수 없습니다. ${e}`
				}
			}
		}) 
	}
}