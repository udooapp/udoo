import com.udoo.dal.entities.user.User;
import com.udoo.dal.repositories.IUserRepository;
import com.udoo.dal.spring.PersistenceConfig;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import javax.annotation.Resource;
import java.util.Date;

/**
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes=PersistenceConfig.class)
public class UserGenerator {

    @Resource
    private IUserRepository userRepository;

    @Test
    public void insertNew100User() {
        int i;
        for(i = 0; i < 100; ++i) {
            Date date = new Date();
            final User user = new User();
            user.setName("TestUser" + date.getTime());
            user.setPassword("password");
            user.setActive(15);
            user.setEmail("testUser" + date.getTime() + "@email.com");
            user.setBirthdate("1999-09-09");
            user.setLanguage("en");
            user.setPhone("0654321987");
            user.setStars(0);
            user.setType(date.getTime() % 2 == 0 ? 0 : 1);
            if(userRepository.save(user) == null){
                break;
            }
        }
        Assert.assertEquals(100,i);// userRepository.save(user) != null);
    }
}