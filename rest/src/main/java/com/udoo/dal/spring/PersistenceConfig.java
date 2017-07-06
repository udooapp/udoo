package com.udoo.dal.spring;

import com.udoo.dal.dao.CategoryResultDao;
import com.udoo.dal.dao.ICategoryResult;
import com.udoo.restservice.security.SecurityConfig;
import org.hibernate.jpa.HibernatePersistenceProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;
import java.util.Properties;

/**
 */
@Configuration
@EnableTransactionManagement
@EnableJpaRepositories("com.udoo.dal.repositories")
@Import({SecurityConfig.class})
@PropertySource("classpath:database.properties")
public class PersistenceConfig {

    @Autowired
    private Environment env;

    private static final String PROPERTY_HIBERNATE_DIALECT = "hibernate.dialect";
    private static final String PROPERTY_HIBERNATE_SHOW_SQL = "hibernate.show_sql";
    private static final String PROPERTY_HIBERNATE_FORMAT_SQL = "hibernate.format_sql";

    public static final String TRUE_TAG = "true";


    @Bean(name = "dataSource")
    public DriverManagerDataSource dataSource() {
        DriverManagerDataSource driverManagerDataSource = new DriverManagerDataSource();
        driverManagerDataSource.setDriverClassName(env.getProperty("driver.name"));
        driverManagerDataSource.setUrl(env.getProperty("driver.url"));
        driverManagerDataSource.setUsername(env.getProperty("driver.user"));
        driverManagerDataSource.setPassword(env.getProperty("driver.password"));
        return driverManagerDataSource;
    }

    @Bean
    public LocalContainerEntityManagerFactoryBean entityManagerFactory() {
        final LocalContainerEntityManagerFactoryBean entityManagerFactoryBean = new LocalContainerEntityManagerFactoryBean();

        final DriverManagerDataSource dataSource = dataSource();
        entityManagerFactoryBean.setDataSource(dataSource);
        entityManagerFactoryBean.setPersistenceProviderClass(HibernatePersistenceProvider.class);
        entityManagerFactoryBean.setPackagesToScan("com.udoo.dal.entities");

        entityManagerFactoryBean.setJpaProperties(hibernateProperties(""));

        return entityManagerFactoryBean;
    }

    private static Properties hibernateProperties(final String hibernateDialect) {
        final Properties properties = new Properties();
        properties.setProperty(PROPERTY_HIBERNATE_DIALECT, hibernateDialect);
        properties.setProperty(PROPERTY_HIBERNATE_SHOW_SQL, TRUE_TAG);
        properties.setProperty(PROPERTY_HIBERNATE_FORMAT_SQL, TRUE_TAG);
        return properties;
    }

    @Bean
    public JpaTransactionManager transactionManager(final LocalContainerEntityManagerFactoryBean factory) {
        final JpaTransactionManager transactionManager = new JpaTransactionManager();
        transactionManager.setEntityManagerFactory(factory.getObject());
        return transactionManager;
    }

    @Bean
    public SimpleMailMessage templateSimpleMessage() {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setText("This is the test email template for your email:\n%s\n");
        return message;
    }

    @Bean
    public ICategoryResult iCategoryResult(DataSource dataSource) {
        CategoryResultDao result = new CategoryResultDao();
        result.setDataSource(dataSource);
        return result;
    }
}