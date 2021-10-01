// 로그인 여부 확인
export const protectResolver = (outResolver) => (root, args, context, info) => {
	// args -> param 들어있음
	// context -> header에 들어가있는 토큰 정보 있음
	
	if(!context.loggedInUser){
		// info 를 통해 mutation인지 query인지 확인
		// query는 그냥 실행될수 있으므로 로그인여부 파악이 없어도 됨
		const query = info.operation.operation === "query";
		if(query){
			return null;
		}else{
			return {
				ok : false,
				error : "로그인이 필요합니다."
			}
		}
	}
	
	return outResolver(root,args,context,info);
}