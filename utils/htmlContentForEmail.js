const restLinkContent = (user_name, user_email, admin_message, from_name) => {
    return content = `<div
    style="font-family:'Open Sans','Roboto','Helvetica Neue',Helvetica,Arial,sans-serif;font-size:16px;color:#2c3e50;line-height:150%;letter-spacing:normal">
    <div style="background:#f9f9f9;padding:20px 10px">
        <div
            style="max-width:600px;margin:auto;padding:15px 30px 25px 30px;background-color:#ffffff;border-radius:3px;border-bottom:1px solid #dadada;border-top:1px solid #eaeaea">
            <div style="margin:5px 0 30px"><a style="text-decoration:none;outline:none"
                    href="https://templatehub.onrender.com/" target="_blank"
                    data-saferedirecturl="https://www.google.com/url?q=https://templatehub.onrender.com/">
                    <img style="height:18px"
                        src="https://ci3.googleusercontent.com/meips/ADKq_NZGDADigYE6x_r4R_tAG6xpc9igmY-z3vi2a_gPa2ea3ebyZ8Sh8kp6-O2MiJw-WPUX9kR0n82q3MVoehI=s0-d-e1-ft#https://cdn.emailjs.com/assets/logo.png"
                        alt="logo" class="CToWUd" data-bit="iit"/><span
                        style="color:#2c3e50;font-size:22px;margin-left:8px">TemplateHub</span></a></div>
            <p>Hi ${user_name}</p>
            <p>A password reset was requested for your <a href="mailto: ${user_email}"
                    target="_blank">${user_email}</a> TemplateHub account.</p>
            <p>Please click the link below to reset your password and set a new one.</p>
            <p><a style="font-weight:500;display:inline-block;padding:10px 35px;margin:8px 0;text-decoration:none;border-radius:3px;background-color:#4460aa;color:#ffffff"
                    href=${admin_message} rel="noopener" target="_blank"
                    data-saferedirecturl="https://www.google.com/url?q=${admin_message}&amp;source=gmail">Reset
                    password</a></p>
            <p>This link will expire in 1 hours.</p>
            <p>If you're having trouble clicking the button, copy and paste the URL below into your browser:</p>
            <p><a style="color:#4460aa;word-break:break-word" href=${admin_message} rel="noopener" target="_blank"
                    data-saferedirecturl="https://www.google.com/url?q=${admin_message}&amp;source=gmail">${admin_message}</a>
            </p>
            <p>Please let us know if you have any questions, feature requests, or general feedback simply by
                replying to this email.</p>
            <hr style="margin:40px 0;border-color:#dadada;border-style:solid;border-width:1px 0 0 0;height:0"/>
            <p>All the best,<br><strong>The ${from_name}</strong></p>
            <hr style="margin:40px 0 30px;border-color:#dadada;border-style:solid;border-width:1px 0 0 0;height:0"/>
            <p style="font-size:14px">If you didn't request it, please ignore this email.</p>
            <hr style="margin:30px 0;border-color:#dadada;border-style:solid;border-width:1px 0 0 0;height:0"/>
            <table style="width:100%;font-size:12px">
                <tbody>
                    <tr>
                        <td>templatehub.onrender.com, All rights reserved.</td>
                        <td>
                            <div style="text-align:right">Follow us on <a style="color:#4460aa" href="#" rel="noopener"
                                    target="_blank"
                                    data-saferedirecturl="https://www.google.com/url?q=#&amp;source=gmail">Twitter</a>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" style="line-height:1.4">You have received this email because you opted in at
                            our website.</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>`

}


const verifyAccountContent = (user_name, user_email, admin_message, from_name) => {
    return content = ` <div
    style="font-family:'Open Sans','Roboto','Helvetica Neue',Helvetica,Arial,sans-serif;font-size:16px;color:#2c3e50;line-height:150%;letter-spacing:normal">
    <div style="background:#f9f9f9;padding:20px 10px">

        <div
            style="max-width:600px;margin:auto;padding:15px 30px 25px 30px;background-color:#ffffff;border-radius:3px;border-bottom:1px solid #dadada;border-top:1px solid #eaeaea">
            <div style="margin:5px 0 30px"><a style="text-decoration:none;outline:none"
                href="https://templatehub.onrender.com/" target="_blank"
                data-saferedirecturl="https://www.google.com/url?q=https://templatehub.onrender.com/">
                <img style="height:18px"
                    src="https://ci3.googleusercontent.com/meips/ADKq_NZGDADigYE6x_r4R_tAG6xpc9igmY-z3vi2a_gPa2ea3ebyZ8Sh8kp6-O2MiJw-WPUX9kR0n82q3MVoehI=s0-d-e1-ft#https://cdn.emailjs.com/assets/logo.png"
                    alt="logo" class="CToWUd" data-bit="iit" /><span
                        style="color:#2c3e50;font-size:22px;margin-left:8px">TemplateHub</span></a></div>
            <p>Hi ${user_name}</p>
            <p>A verification account code was requested for your <a href="mailto: ${user_email}"
                target="_blank">${user_email}</a> TemplateHub account.</p>
            <p>Your Verification Code: <strong style="color:limegreen">${admin_message}</strong></p>
            <p>This Verification Code will expire in 1 hours.</p>
            <p>Please let us know if you have any questions, feature requests, or general feedback simply by
                replying to this email.</p>
            <hr style="margin:40px 0;border-color:#dadada;border-style:solid;border-width:1px 0 0 0;height:0" />
            <p>All the best,<br /><strong>The ${from_name}</strong></p>
            <hr style="margin:40px 0 30px;border-color:#dadada;border-style:solid;border-width:1px 0 0 0;height:0" />
            <p style="font-size:14px">If you didn't request it, please ignore this email.</p>
            <hr style="margin:30px 0;border-color:#dadada;border-style:solid;border-width:1px 0 0 0;height:0" />
            <table style="width:100%;font-size:12px">
                <tbody>
                    <tr>
                        <td>templatehub.onrender.com, All rights reserved.</td>
                        <td>
                            <div style="text-align:right">Follow us on <a style="color:#4460aa" href="#" rel="noopener"
                                target="_blank"
                                data-saferedirecturl="https://www.google.com/url?q=#&amp;source=gmail">Twitter</a>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" style="line-height:1.4">You have received this email because you opted in at
                            our website.</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>`
}






module.exports = { restLinkContent, verifyAccountContent }