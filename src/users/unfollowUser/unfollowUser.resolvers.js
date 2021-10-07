import client from "../../client";
import {protectResolver} from "../../shared/shared.utils";

export default {
	Mutation : {
		unfollowUser : protectResolver(async(_, {username}, {loggedInUser}) => {
			try {
				// unfollow 하려는 유저가 존재하는지 확인
				const ok = await client.user.findUnique({where : {username}});
				if(!ok){
					throw new Error("해당 유저가 존재하지 않습니다.");
				}
				
				// unfollow 처리 (disconnect 사용)	
				await client.user.update({
					where : {
						id : loggedInUser.id
					},
					data : {
						following : {
							disconnect : {
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
					error : `언팔로우에 실패했습니다. ${e}`
				}
			}			
		})
	}
}