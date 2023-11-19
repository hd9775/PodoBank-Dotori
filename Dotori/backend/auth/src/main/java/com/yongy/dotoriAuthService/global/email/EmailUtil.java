package com.yongy.dotoriAuthService.global.email;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

@Setter
@Component
@RequiredArgsConstructor
public class EmailUtil {

    private String subject;
    private String prefix;

    @Autowired
    private final JavaMailSender javaMailSender;

    public void sendEmailAuthCode(String id, String authCode){
        String text = prefix + authCode + "입니다. <br/>";

        try{
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "utf-8");
            helper.setTo(id);
            helper.setSubject(subject);
            helper.setText(text, true); // 포함된 텍스트가 HTML이라는 의미로 true이다.
            javaMailSender.send(mimeMessage);

        }catch(MessagingException e){
            e.printStackTrace();
        }
    }
}
