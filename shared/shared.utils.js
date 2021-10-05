import AWS from 'aws-sdk';

AWS.config.update({
  credentials: {
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

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

// aws s3 연동
// 파일이 어디에 저장됐는지 알려주는 url을 리턴해줌
export const uploadToS3 = async (file, userId, folderName) => {
  const { filename, createReadStream } = await file;
  const readStream = createReadStream();
  const objectName = `${folderName}/${userId}-${Date.now()}-${filename}`;
  // 파일 저장 url return
  const { Location } = await new AWS.S3()
    .upload({
      Bucket: 'nomad-coffee-kjm',
      Key: objectName,
      ACL: 'public-read', // private 모드 설정
      Body: readStream,
    })
    .promise();

  // url 리턴 전에 파일이 정상인지 올릴수 있는지 확인이 필요함
  return Location;
};
