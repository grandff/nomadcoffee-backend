import client from "../../client";
import {protectResolver} from "../../shared/shared.utils";

export default {
	Mutation : {
		followUser : protectResolver(async(_, {
			username
		}, {
			loggedInUser
		}) => {
			try{
				// follow 하려는 유저가 실제로 있는 유저 인지 확인
				const ok = await client.user.findUnique({where : {username}});
				if(!ok){
					throw new Error("팔로우 하려는 유저가 존재하지 않습니다.");
				}
				
				// follow 처리(connect 이용)	
				// 로그인한 사용자의 팔로잉 숫자가 하나 늘어난거임(상대방은 팔로워 숫자가 하나 늘어난셈)
				await client.user.update({
					where : {
						id : loggedInUser.id
					},
					data : {
						following : {
							connect : {		// unique 필드에만 사용 가능
								username
							}	
						}		
					}
				});
				
				return {
					ok : true
				}
			}catch(e){
				return {
					ok : false,
					error : `팔로우를 할 수 없습니다. ${e}`
				}
			}			
		})
	}
}