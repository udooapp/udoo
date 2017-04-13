package com.udoo.dal.spring;

import com.udoo.restservice.security.SecurityConfig;
import org.hibernate.jpa.HibernatePersistenceProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import java.util.Properties;

/**
 */
@Configuration
@EnableTransactionManagement
@EnableJpaRepositories("com.udoo.dal.repositories")
//@Import({SecurityConfig.class})
public class PersistenceConfig {

    private static final String PROPERTY_HIBERNATE_DIALECT = "hibernate.dialect";
    private static final String PROPERTY_HIBERNATE_SHOW_SQL = "hibernate.show_sql";
    private static final String PROPERTY_HIBERNATE_FORMAT_SQL = "hibernate.format_sql";

    public static final String TRUE_TAG = "true";


    @Bean(name = "dataSource")
    public DriverManagerDataSource dataSource() {
        DriverManagerDataSource driverManagerDataSource = new DriverManagerDataSource();
        driverManagerDataSource.setDriverClassName("com.mysql.jdbc.Driver");
        driverManagerDataSource.setUrl("jdbc:mysql://localhost/udoo");
        driverManagerDataSource.setUsername("undoouser");
        driverManagerDataSource.setPassword("udoo");
        return driverManagerDataSource;
    }

    @Bean
    public LocalContainerEntityManagerFactoryBean entityManagerFactory() {
        final LocalContainerEntityManagerFactoryBean entityManagerFactoryBean = new LocalContainerEntityManagerFactoryBean();

        final DriverManagerDataSource dataSource = new DriverManagerDataSource();

        dataSource.setDriverClassName("com.mysql.jdbc.Driver");
        dataSource.setUrl("jdbc:mysql://localhost/udoo?user=undoouser&password=udoo");


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
}