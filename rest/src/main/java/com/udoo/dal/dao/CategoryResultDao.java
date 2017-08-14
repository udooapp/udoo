package com.udoo.dal.dao;

import com.udoo.dal.entities.search.SearchElement;
import org.springframework.jdbc.core.support.JdbcDaoSupport;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


/**
 */
public class CategoryResultDao extends JdbcDaoSupport implements ICategoryResult {
    private class ResultElement {
        private String categoryName;
        private Map<String, Integer> map;

        private String getCategoryName() {
            return categoryName;
        }

        private void setCategoryName(String categoryName) {
            this.categoryName = categoryName;
        }

        private Map<String, Integer> getMap() {
            return map;
        }

        private void setMap(Map<String, Integer> map) {
            this.map = map;
        }
    }

    @Override
    public List<SearchElement> getAllCategories(String text) {
        String sqlO1 = "SELECT distinct c.cid as cid, c.name as name, o.title as text FROM Offer o, Categories c WHERE c.cid = o.category AND  LOWER(o.title) LIKE CONCAT('%',LOWER('" + text + "'),'%') AND o.expirydate > CURRENT_DATE AND o.uid NOT IN (SELECT v.uid FROM Verification v Where v.type = 0) Group By c.cid, c.name, o.title";
        String sqlO2 = "SELECT distinct c.cid as cid, c.name as name, o.description as text FROM Offer o, Categories c WHERE c.cid = o.category AND LOWER(o.description) LIKE CONCAT('%',LOWER('" + text + "'),'%') AND o.expirydate > CURRENT_DATE AND o.uid NOT IN (SELECT v.uid FROM Verification v Where v.type = 0) Group By c.cid, c.name, o.description";
        String sqlR1 = "SELECT distinct c.cid as cid, c.name as name, r.title as text FROM Request r, Categories c WHERE c.cid = r.category AND  LOWER(r.title) LIKE CONCAT('%',LOWER('" + text + "'),'%') AND r.expirydate > CURRENT_DATE AND r.uid NOT IN (SELECT v.uid FROM Verification v Where v.type = 0) Group By c.cid, c.name, r.title";
        String sqlR2 = "SELECT distinct c.cid as cid, c.name as name, r.description as text FROM Request r, Categories c WHERE c.cid = r.category AND LOWER(r.description) LIKE CONCAT('%',LOWER('" + text + "'),'%') AND r.expirydate > CURRENT_DATE AND r.uid NOT IN (SELECT v.uid FROM Verification v Where v.type = 0) Group By c.cid, c.name, r.description";
        Map<Integer, ResultElement> result = new HashMap<>();
        mapping(getJdbcTemplate().queryForList(sqlO1), result, text);
        mapping(getJdbcTemplate().queryForList(sqlO2), result, text);
        mapping(getJdbcTemplate().queryForList(sqlR1), result, text);
        mapping(getJdbcTemplate().queryForList(sqlR2), result, text);

        return getCategories(result, text);
    }

    @Override
    public String getWordMatch(String text) {
        if (!text.isEmpty()) {
            String sql1 = "SELECT r.title as title FROM Request r WHERE LOWER(r.title) LIKE CONCAT('%', LOWER('" + text + "'), '%')";
            String sql2 = "SELECT o.title as title FROM Offer o WHERE LOWER(o.title) LIKE CONCAT('%', LOWER('" + text + "'), '%')";
            return getResult(mappingTitle(getJdbcTemplate().queryForList(sql1), text), mappingTitle(getJdbcTemplate().queryForList(sql2), text));
        } else {
            return "";
        }
    }

    private List<SearchElement> getCategories(Map<Integer, ResultElement> result, String searchText) {
        List<SearchElement> list = new ArrayList<>();
        for (HashMap.Entry<Integer, ResultElement> entry : result.entrySet()) {
            SearchElement element = new SearchElement();
            element.setId(entry.getKey());
            element.setCategoryName(entry.getValue().getCategoryName());
            int max = 0;
            String word = "";
            Map<String, Integer> map = entry.getValue().getMap();
            for (HashMap.Entry<String, Integer> entryWord : map.entrySet()) {
                if (entryWord.getValue() > max) {
                    max = entryWord.getValue();
                    word = entryWord.getKey();
                }
            }
            if (!word.isEmpty()) {
                element.setSearchResult(word);
            }
            list.add(element);
        }
        return list;
    }

    private void mapping(List<Map<String, Object>> rows, Map<Integer, ResultElement> map, String searchText) {
        Pattern pattern = Pattern.compile("([\\-'a-z]{3,}\\s)?((" + searchText.toLowerCase() + ")[\\-a-z']*)(\\s[\\-'a-z]{3,})?");
        Pattern pattern2 = Pattern.compile("(" + searchText.toLowerCase() + ")[\\-a-z']*");
        for (Map row : rows) {
            String text = "";
            Matcher m = pattern.matcher(row.get("text").toString().toLowerCase());
            if (m.find()) {
                text = m.group();
            }
            if (!text.isEmpty() && text.length() > 2) {
                int id = (Integer) row.get("cid");
                Matcher m2 = pattern2.matcher(text);
                if (m2.find()) {
                    String match = m2.group();
                    String matchWords[] = match.split("\\s");
                    if (matchWords[matchWords.length - 1].length() > 2) {
                        String s[] = text.replace(match, "*").split("\\s");
                        if (!map.containsKey(id)) {
                            ResultElement categoryResult = new ResultElement();
                            categoryResult.setCategoryName(row.get("name").toString());
                            Map<String, Integer> wordMap = new HashMap<>();
                            wordMap.put(match, 1);
                            if (s.length == 2) {
                                if (s[0].equals("*")) {
                                    wordMap.put(match + s[1], 1);
                                } else {
                                    wordMap.put(s[0] + match, 1);
                                }
                            } else if (s.length == 3) {
                                wordMap.put(s[0] + " " + match, 1);
                                wordMap.put(match + " " + s[2], 1);
                            }
                            categoryResult.setMap(wordMap);
                            map.put(id, categoryResult);
                        } else {
                            Map<String, Integer> wordMap = map.get(id).getMap();

                            if (wordMap.containsKey(match)) {
                                wordMap.put(match, wordMap.get(match) + 1);
                            } else {
                                wordMap.put(match, 1);
                            }
                            if (s.length == 2) {
                                String part = s[0].equals("*") ? match + " " + s[0] : s[1] + " " + match;
                                if (wordMap.containsKey(part)) {
                                    wordMap.put(part, wordMap.get(part) + 1);
                                } else {
                                    wordMap.put(part, 1);
                                }
                            } else if (s.length == 3) {
                                if (wordMap.containsKey(s[0] + " " + match)) {
                                    wordMap.put(s[0], wordMap.get(s[0] + " " + match) + 1);
                                } else {
                                    wordMap.put(s[0] + " " + match, 1);
                                }
                                if (wordMap.containsKey(match + " " + s[2])) {
                                    wordMap.put(match + " " + s[2], wordMap.get(match + " " + s[2]) + 1);
                                } else {
                                    wordMap.put(match + " " + s[2], 1);
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    private Map<String, Integer> mappingTitle(List<Map<String, Object>> rows, String searchText) {
        Map<String, Integer> result = new HashMap<>();
        Pattern p = Pattern.compile("(" + searchText.toLowerCase() + ")[a-z0-9]*");
        for (Map row : rows) {
            String text = "";
            Matcher m = p.matcher(row.get("title").toString().toLowerCase());
            if (m.find()) {
                text = m.group();
            }
            if (!text.isEmpty()) {
                if (result.get(text) == null) {
                    result.put(text, 1);
                } else {
                    result.put(text, result.get(text) + 1);
                }
            }
        }
        return result;
    }


    private String getResult(Map<String, Integer> map1, Map<String, Integer> map2) {
        int max = 0;
        String result = "";
        for (HashMap.Entry<String, Integer> entry : map1.entrySet()) {
            int num = entry.getValue();
            String key = entry.getKey();
            if (map2.get(key) != null) {
                num += map2.get(key);
                map2.remove(key);
            }
            if (num > max) {
                max = num;
                result = key;
            }
        }
        for (HashMap.Entry<String, Integer> entry : map2.entrySet()) {
            int num = entry.getValue();
            String key = entry.getKey();
            if (num > max) {
                max = num;
                result = key;
            }
        }
        return result;
    }

}
