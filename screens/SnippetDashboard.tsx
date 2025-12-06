import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
  Image,
} from 'react-native';
import Header from '../components/Header';

const SnippetDashboard = () => {

  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = ['All', 'Methods', 'HTML', 'Angular', 'Css', 'Php', 'React'];
  const snippets = [
    {
      title: 'Custom Sweet alert',
      version: '1.0.2.3',
      date: '31 Oct 2024, 3:19 PM',
      tags: ['Redux toolkit'],
      codeView: true,
    },
    {
      title: 'Date range picker',
      version: '1.0.2.4',
      date: '14 Sep 2025, 3:14 PM',
      tags: [],
      codeView: true,
    },
    {
      title: 'Custom Tooltip',
      version: '1.0.2.5',
      date: '24 Nov 2024, 1:26 AM',
      tags: ['Lazy Loading'],
      codeView: true,
    },
    {
      title: 'Bottery react',
      version: '1.0.2.6',
      date: '8 Dec 2024, 1:09 AM',
      tags: [],
      codeView: true,
      links: ['Home', 'Blogs', 'Html', 'Tasks', 'Chat', 'Expenses', 'Screen Recording', 'Login'],
    },
    {
      title: 'Custom Select Dropdown',
      version: '1.0.2.7',
      date: '23 Nov 2024, 5:44 PM',
      tags: ['Api client 2'],
      codeView: true,
    },
    {
      title: 'Async Select Dropdown',
      version: '1.0.2.8',
      date: '16 Aug 2024, 3:52 PM',
      tags: [],
      codeView: true,
    },
  ];

  const filteredSnippets = snippets.filter(snippet =>
    snippet.title.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
    snippet.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase().trim()))
  );

  const renderSnippetCard = ({ item }: any) => (
    <View style={styles.snippetCard}>
      <View style={styles.snippetHeader}>
        <View>
          <Text style={styles.snippetTitle}>{item.title}</Text>
          <Text style={styles.snippetVersion}>Version {item.version}</Text>
        </View>
        <View style={styles.dateBadge}>
          {/* <Icon name="access-time" size={14} color="#666" /> */}
          <Text style={styles.dateText}>{item.date}</Text>
        </View>
      </View>

      {item.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {item.tags.map((tag: any, index: number) => (
            <View key={index} style={styles.tag}>
              {/* <Icon name="tag" size={12} color="#4361EE" /> */}
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      )}

      {item.links && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.linksContainer}>
          {item.links.map((link: any, index: number) => (
            <TouchableOpacity key={index} style={styles.linkChip}>
              <Text style={styles.linkText}>{link}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <TouchableOpacity style={styles.viewCodeButton}>
        {/* <Icon name="code" size={16} color="#fff" /> */}
        <Text style={styles.viewCodeText}>View Code</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header/>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerSubtitle}>Code Snippet</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Image
          source={require('../assets/img/search.png')}
          style={{ objectFit: 'contain' }}
          height={15}
          width={15}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search snippets..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Image
              source={require('../assets/img/close.png')}
              style={{ objectFit: 'contain' }}
              height={15}
              width={15}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Tabs */}
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsContainer}>
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>


      {/* Snippets List */}
      <FlatList
        data={filteredSnippets}
        renderItem={renderSnippetCard}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            {/* <Icon name="code-off" size={60} color="#CCC" /> */}
            <Text style={styles.emptyText}>No snippets found</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A2E',
  },
  totalBadge: {
    backgroundColor: '#4361EE',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  totalText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  headerSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A2E',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E6F0FF',
  },
  profileInfo: {
    marginLeft: 12,
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A2E',
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginLeft: 16,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF4757',
  },
  quickLinksContainer: {
    flexGrow: 0,
    marginBottom: 10,
  },
  quickLink: {
    alignItems: 'center',
    marginRight: 20,
  },
  quickLinkIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F0F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  quickLinkText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
  },
  tabsContainer: {
    paddingHorizontal: 16,
    marginBottom: 8
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  activeTab: {
    backgroundColor: '#4361EE',
    borderColor: '#4361EE',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  snippetCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  snippetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  snippetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginBottom: 4,
  },
  snippetVersion: {
    fontSize: 14,
    color: '#4361EE',
    fontWeight: '500',
  },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  dateText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 6,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F0FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    color: '#4361EE',
    fontWeight: '500',
    marginLeft: 4,
  },
  linksContainer: {
    marginBottom: 16,
  },
  linkChip: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  linkText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  viewCodeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4361EE',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 8,
  },
  viewCodeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
  },
});

export default SnippetDashboard;