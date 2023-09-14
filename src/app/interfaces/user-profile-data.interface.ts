/**
 * @작성자 임호균
 * @작서일 2023-08-25
 * @description 유저 프로필 정보에 대한 interface(type) 지정
 */
export interface UserProfileData {
    //사용자 이름
    username: string,
    //프로필 이미지 
    profileImgPath: string,
    //매니저 여부
    isManager: boolean
}