import com.udoo.dal.entities.offer.Offer;
import com.udoo.dal.repositories.offer.IOfferRepository;
import com.udoo.dal.spring.PersistenceConfig;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import javax.annotation.Resource;
import java.util.Date;
import java.util.Random;

/**
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = PersistenceConfig.class)
public class OfferServiceGenerator {
    private static String[] words = ("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec libero leo. Fusce posuere nunc sem, non iaculis tortor ultricies non. Mauris nec pellentesque metus. Quisque auctor mi libero, eu laoreet ligula porttitor at. Duis ullamcorper dui et magna viverra ullamcorper. Proin pretium lorem lobortis, vulputate neque sed, sagittis sem. Nam id enim semper, fringilla odio quis, mattis eros. In non fermentum ipsum. Quisque venenatis elit sed nisl volutpat, et sodales ligula vestibulum. Ut aliquet condimentum magna sit amet ullamcorper. Sed sagittis nisl id tincidunt laoreet.\n" +
            "\n" +
            "Pellentesque at nisi libero. Nam elementum urna sed finibus tempor. Curabitur sit amet ex vestibulum nibh consectetur tempor. Mauris at tortor at nulla mollis commodo at sit amet eros. Fusce vitae dignissim sapien, ac ultricies magna. Integer tristique vehicula ex, a gravida tellus. Etiam facilisis nec libero sit amet facilisis. Nam ante lacus, imperdiet sed pulvinar nec, dapibus vel dui. Quisque dignissim pretium urna, sit amet aliquam nunc volutpat sit amet. Donec consequat ligula in accumsan aliquet. Vivamus pulvinar lectus eu luctus pulvinar. In euismod nisl arcu, auctor lobortis dolor pharetra vitae.\n" +
            "\n" +
            "Ut fermentum lacinia dolor a iaculis. Nam in pellentesque ipsum, et sollicitudin mi. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Quisque sed ante neque. Maecenas non magna augue. Suspendisse lacus nibh, imperdiet sit amet gravida non, viverra ut neque. Nullam eget venenatis enim. Donec tempus metus nisi, in faucibus tellus cursus a. Cras id sapien volutpat, viverra erat hendrerit, elementum leo.\n" +
            "\n" +
            "Cras interdum erat vel justo vehicula pulvinar. Donec nec tempus leo. Praesent aliquet augue ut orci tristique suscipit. Ut id purus tortor. Morbi vestibulum convallis cursus. Etiam sit amet pharetra neque, vel accumsan ligula. Sed sagittis fringilla velit eget tristique. Morbi ut sem ac nunc auctor interdum. Nullam est mauris, ullamcorper quis turpis non, gravida suscipit lectus. Nulla efficitur mauris quis magna consectetur tincidunt. Sed suscipit maximus euismod. Nulla facilisi.\n" +
            "\n" +
            "Quisque eleifend volutpat quam, placerat tristique mi hendrerit eu. Quisque in mauris non arcu aliquet ullamcorper. Ut in mi facilisis, mollis turpis sed, pretium justo. Integer eu lorem euismod, euismod odio quis, feugiat leo. Nulla a viverra nulla. Maecenas lobortis mauris est, feugiat mollis augue cursus eu. Quisque urna libero, posuere sit amet turpis ut, dapibus faucibus velit. Etiam nulla nibh, ultrices sit amet metus ut, feugiat lobortis eros. Donec efficitur nunc ut mauris sodales tempus et ac est. In non sapien enim. Duis eleifend at justo id eleifend. Nam malesuada gravida erat, eu vehicula leo posuere tempus. Vivamus euismod sagittis condimentum. Duis sodales purus vehicula tortor malesuada tincidunt. Nullam facilisis cursus justo ac tristique. In bibendum lacinia eros consectetur ornare.\n" +
            "\n" +
            "Vivamus egestas fringilla odio, sed aliquet eros tempus non. Cras semper ultrices vestibulum. Donec pellentesque in augue a cursus. Aenean et rhoncus velit, at euismod ipsum. Nullam rhoncus nunc ac eros fermentum, at ultricies odio finibus. Fusce venenatis lacinia placerat. Duis aliquet lacus ex, quis aliquam neque mattis ut. Pellentesque erat nulla, pulvinar non sodales ut, malesuada vel nunc. Nunc a accumsan sem, sit amet elementum sapien. Ut placerat erat in velit efficitur, in vehicula magna sagittis. Ut sagittis ante tellus, eu blandit nisi venenatis ac. Donec dignissim dui in justo sodales, ac interdum orci rhoncus. Duis nec nisi pellentesque, dictum ex et, commodo augue.\n" +
            "\n" +
            "Mauris interdum condimentum feugiat. Etiam sed enim vehicula mi sagittis volutpat. Integer dictum odio sit amet volutpat tincidunt. Donec commodo pulvinar tortor, vitae placerat mauris consectetur sed. Cras dictum arcu et est rutrum, et tincidunt turpis semper. Nulla at eros sagittis, tristique orci non, porta sapien. In auctor tristique dictum. Proin varius leo et sapien imperdiet, eget ullamcorper ligula malesuada. Nam et tempus turpis, non accumsan diam. Sed aliquet lorem vitae sem maximus dignissim. Pellentesque ut quam leo. Aenean nisl nulla, aliquam in ultrices sit amet, vulputate non lacus. Pellentesque et viverra ante, semper luctus mi. Praesent tempus nibh semper accumsan euismod.\n" +
            "\n" +
            "Suspendisse finibus luctus nibh accumsan finibus. Nulla ut tempus nisl. Praesent velit enim, facilisis et ipsum ut, consequat suscipit nisi. Nulla malesuada efficitur placerat. Donec mollis vitae risus a sagittis. In hac habitasse platea dictumst. Donec tempus venenatis ipsum eu imperdiet. Phasellus sit amet aliquam ante. Cras dapibus, arcu eget laoreet luctus, nisl magna molestie est, eu mollis quam dolor ac purus. Phasellus sodales felis sit amet risus consectetur, tempus congue elit eleifend. Vestibulum pharetra laoreet venenatis. Nullam aliquet metus sit amet nisi aliquet aliquet.\n" +
            "\n" +
            "Praesent aliquam, leo non consequat malesuada, purus nisi iaculis felis, sed varius dolor tortor vel sapien. Fusce finibus quam nec ante pretium porttitor ut ut nulla. Aliquam ac lorem nulla. Praesent posuere dolor quis urna porta maximus. Morbi non facilisis tortor. Vivamus eu sapien vel nisl feugiat bibendum id et nunc. Donec quis arcu blandit, volutpat elit sed, condimentum justo. Nunc dignissim felis nunc, quis maximus velit condimentum sed. Suspendisse tincidunt felis sed porta laoreet. Integer convallis egestas placerat. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Vivamus consectetur, felis at pellentesque dictum, felis nisi pulvinar mi, sit amet posuere lorem mauris at leo. Curabitur placerat leo id sem tempus aliquam. Nunc orci dui, varius sit amet rhoncus non, elementum in urna. Aliquam dignissim odio quis libero pharetra faucibus.\n" +
            "\n" +
            "Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Maecenas feugiat ligula sit amet nisi consectetur blandit. Nam quam elit, lacinia id laoreet vel, pellentesque eu nulla. Mauris id lectus dictum, tristique ipsum at, pellentesque tortor. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Proin eget suscipit tortor, nec pulvinar odio. Aliquam gravida diam finibus sapien sagittis vulputate. Morbi ligula velit, accumsan nec condimentum sit amet, rhoncus quis risus. Mauris nisl sem, rhoncus nec turpis non, mollis consequat elit. Fusce in arcu tincidunt, ullamcorper dui sed, egestas urna. Ut et nisl libero. Sed ut tortor finibus, lacinia mi eget, pretium libero.").split("[\\s.,?!;:]");

    @Resource
    private IOfferRepository offerRepository;

    @Test
    public void insertNew100Offer() {
        int i;
        Random rand = new Random();
        for (i = 0; i < 100; ++i) {
            Date date = new Date();
            date.setTime(date.getTime() + 864000000);
            final Offer offer = new Offer();
            offer.setUid(138);
            offer.setAvailability("0-24");
            offer.setCategory(rand.nextInt(13) + 1);
            offer.setDescription(generateText(rand.nextInt(500) + 10));
            offer.setTitle("Offer" + generateText(rand.nextInt(5) + 2));
            offer.setExpirydate(date);
            offer.setLocation("{\"coordinate\":{\"lat\":" + (48.227747 + rand.nextFloat() * 2 - 1) + ",\"lng\":" + (16.387340999999992 + rand.nextFloat() * 2 - 1) + "},\"address\":\"Taborstraße 102-108, 1020 Wien, Austria\"}");
            if (offerRepository.save(offer) == null) {
                break;
            }
        }
        Assert.assertEquals(100, i);// userRepository.save(user) != null);
    }

    private String generateText(int length) {
        String text = "";
        Random rand = new Random();
        for (int i = 0; i < length; ++i) {
            text += " " + words[rand.nextInt(words.length)];
        }
        return text;
    }
}