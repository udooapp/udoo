import com.udoo.dal.entities.user.User;
import com.udoo.dal.repositories.IUserRepository;
import com.udoo.dal.spring.PersistenceConfig;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import javax.annotation.Resource;

/**
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes=PersistenceConfig.class)
public class UserTest {

    @Resource
    private IUserRepository userRepository;

    @Test
    public void test() {

        final User user = new User();
        user.setName("firsttest lasttest");

        userRepository.save(user);
    }
}