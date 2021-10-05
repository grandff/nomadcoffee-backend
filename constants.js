export const emailCheck = /^((\w|[\-\.])+)@((\w|[\-\.])+)\.([A-Za-z]+)$/;
export const passwordCheck = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{6,}$/;
export const categoryCheck = /[\{\}\[\]\/?.,;:|\)*~`!^\-+<>@\#$%&\\\=\(\'\"]/gi;