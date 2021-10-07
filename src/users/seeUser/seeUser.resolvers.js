import client from "../../client";

export default {
	Query : {
		seeUser : async(_, {username, page}) => {
			try{
				// 해당 유저가 있는지 확인
				const ok = await client.user.findUnique({where : {username}});
				if(!ok){
					throw new Error("해당 유저가 존재하지 않습니다.");
				}
				
				// 해당 유저의 팔로워 정보 조회
				const followers = await client.user.findUnique({where : {username}}).followers({
					take : 10,
					skip : (page - 1) * 10
				});
				
				// 해당 유저 팔로워의 전체 페이지 수 리턴
				// 해당 유저를 팔로잉 하고 있는 유저들의 수 -> 해당 유저의 전체 팔로워 수				
				const followersCount = await client.user.count({where : {following : {some : {username}}}});
				const followersPages = Math.ceil(followersCount / 10);
				
				// 해당 유저의 팔로잉 정보 조회
				const following = await client.user.findUnique({where : {username}}).following({
					take : 10,
					skip : (page - 1) * 10
				});
				
				// 해당 유저 팔로잉 전체 페이지 수 리턴
				const followingCount = await client.user.count({where : {followers : {some : {username}}}});
				const followingPages = Math.ceil(followingCount / 10);
				
				return {
					ok : true,
					followers,
					followersPages,
					following,
					followingPages
				}
				
			}catch(e){
				return {
					ok : false,
					error : `정보 조회에 실패했습니다. ${e}`
				}
			}
		}
	}
}