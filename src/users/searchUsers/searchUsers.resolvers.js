import client from "../../client";

export default {
	Query : {
		searchUsers : async(_, {keyword, page}) => {
			// findmany with pagination
			// lowercase로 대소문자 구분 없이 처리
			// contains으로 해당 문자열을 포함한 사람 전부 검색
			const users = await client.user.findMany({
				where : {
					username : {
						contains : keyword.toLowerCase()	
					},					
				},
				take : 10,
				skip : (page - 1) * 10
			});
			
			return users;
		}
	}
}