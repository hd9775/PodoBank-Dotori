package com.bank.podo.global.email.message;

import org.springframework.context.annotation.Configuration;

@Configuration
public class EmailMessage {
    public String generateRegisterMessage(String code) {
        String message = "";
        message += "<table align=\"center\" width=\"670\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"border-width: 2px 1px 1px; border-style: solid; border-color: rgb(157, 87, 208) rgb(231, 231, 231) rgb(231, 231, 231);\">";
        message += "<tbody><tr><td style=\"background-color: rgb(255, 255, 255); padding: 40px 30px 0px 35px; text-align: center;\">";
        message += "<table width=\"605\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"text-align: left; font-family: &quot;맑은 고딕&quot;, 돋움;\">";
        message += "<tbody><tr><td style=\"color: rgb(157, 87, 208); font-size: 25px; text-align: left; width: 352px; word-spacing: -1px; vertical-align: top;\">";
        message += "인증 번호 확인 후<br>";
        message += "이메일 인증을 완료해 주세요.";
        message += "</td><td rowspan=\"3\" style=\"\"><img src=\"\"></td></tr>";
        message += "<tr><td height=\"39\" style=\"\"><img src=\"\"></td></tr>";
        message += "<tr><td style=\"font-size: 17px; vertical-align: bottom; height: 27px;\">안녕하세요? 포도은행입니다.</td></tr>";
        message += "<tr><td colspan=\"2\" style=\"font-size: 13px; word-spacing: -1px; height: 30px;\">아래 인증번호를 입력하시고 회원가입을 계속 진행해 주세요.</td></tr></tbody></table>";
        message += "</td></tr>";
        message += "<tr><td style=\"padding: 39px 196px 70px;\">";
        message += "<table width=\"278\" style=\"background-color: rgb(156, 139, 254); font-family: &quot;맑은 고딕&quot;, 돋움;\">";
        message += "<tbody><tr><td height=\"49\" style=\"text-align: center; color: rgb(255, 255, 255);\">인증번호 : <span>" + code + "</span></td></tr>";
        message += "</tbody></table>";
        message += "</td></tr>";
        message += "</tbody></table>";

        return message;
    }

    public String generatePasswordResetMessage(String code) {
        String message = "";
        message += "<table align=\"center\" width=\"670\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"border-width: 2px 1px 1px; border-style: solid; border-color: rgb(157, 87, 208) rgb(231, 231, 231) rgb(231, 231, 231);\">";
        message += "<tbody><tr><td style=\"background-color: rgb(255, 255, 255); padding: 40px 30px 0px 35px; text-align: center;\">";
        message += "<table width=\"605\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"text-align: left; font-family: &quot;맑은 고딕&quot;, 돋움;\">";
        message += "<tbody><tr><td style=\"color: rgb(157, 87, 208); font-size: 25px; text-align: left; width: 352px; word-spacing: -1px; vertical-align: top;\">";
        message += "인증 번호 확인 후<br>";
        message += "이메일 인증을 완료해 주세요.";
        message += "</td><td rowspan=\"3\" style=\"\"><img src=\"\"></td></tr>";
        message += "<tr><td height=\"39\" style=\"\"><img src=\"\"></td></tr>";
        message += "<tr><td style=\"font-size: 17px; vertical-align: bottom; height: 27px;\">안녕하세요? 포도은행입니다.</td></tr>";
        message += "<tr><td colspan=\"2\" style=\"font-size: 13px; word-spacing: -1px; height: 30px;\">아래 인증번호를 입력하시고 비밀번호 초기화를 계속 진행해 주세요.</td></tr></tbody></table>";
        message += "</td></tr>";
        message += "<tr><td style=\"padding: 39px 196px 70px;\">";
        message += "<table width=\"278\" style=\"background-color: rgb(156, 139, 254); font-family: &quot;맑은 고딕&quot;, 돋움;\">";
        message += "<tbody><tr><td height=\"49\" style=\"text-align: center; color: rgb(255, 255, 255);\">인증번호 : <span>" + code + "</span></td></tr>";
        message += "</tbody></table>";
        message += "</td></tr>";
        message += "</tbody></table>";

        return message;
    }

    public String generateAccountPasswordResetMessage(String code) {
        String message = "";
        message += "<table align=\"center\" width=\"670\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"border-width: 2px 1px 1px; border-style: solid; border-color: rgb(157, 87, 208) rgb(231, 231, 231) rgb(231, 231, 231);\">";
        message += "<tbody><tr><td style=\"background-color: rgb(255, 255, 255); padding: 40px 30px 0px 35px; text-align: center;\">";
        message += "<table width=\"605\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"text-align: left; font-family: &quot;맑은 고딕&quot;, 돋움;\">";
        message += "<tbody><tr><td style=\"color: rgb(157, 87, 208); font-size: 25px; text-align: left; width: 352px; word-spacing: -1px; vertical-align: top;\">";
        message += "인증 번호 확인 후<br>";
        message += "이메일 인증을 완료해 주세요.";
        message += "</td><td rowspan=\"3\" style=\"\"><img src=\"\"></td></tr>";
        message += "<tr><td height=\"39\" style=\"\"><img src=\"\"></td></tr>";
        message += "<tr><td style=\"font-size: 17px; vertical-align: bottom; height: 27px;\">안녕하세요? 포도은행입니다.</td></tr>";
        message += "<tr><td colspan=\"2\" style=\"font-size: 13px; word-spacing: -1px; height: 30px;\">아래 인증번호를 입력하시고 계좌 비밀번호 초기화를 계속 진행해 주세요.</td></tr></tbody></table>";
        message += "</td></tr>";
        message += "<tr><td style=\"padding: 39px 196px 70px;\">";
        message += "<table width=\"278\" style=\"background-color: rgb(156, 139, 254); font-family: &quot;맑은 고딕&quot;, 돋움;\">";
        message += "<tbody><tr><td height=\"49\" style=\"text-align: center; color: rgb(255, 255, 255);\">인증번호 : <span>" + code + "</span></td></tr>";
        message += "</tbody></table>";
        message += "</td></tr>";
        message += "</tbody></table>";

        return message;
    }
}
