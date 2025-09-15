// Social Media Service for One-Click Posting
// Integrates with Facebook/Meta, LinkedIn, and Twitter APIs

import Communication from '@/models/Communication';

export interface SocialPost {
  id?: string;
  agentId: string;
  platform: 'facebook' | 'linkedin' | 'twitter' | 'instagram';
  content: string;
  mediaUrls?: string[];
  scheduledAt?: Date;
  postedAt?: Date;
  status: 'draft' | 'scheduled' | 'posting' | 'posted' | 'failed';
  postId?: string; // Platform's post ID
  engagement?: {
    likes: number;
    shares: number;
    comments: number;
    clicks: number;
    impressions: number;
  };
  propertyId?: string;
  campaign?: string;
  tags?: string[];
}

export interface SocialCredentials {
  facebook?: {
    accessToken: string;
    pageId: string;
  };
  linkedin?: {
    accessToken: string;
    organizationId?: string;
  };
  twitter?: {
    apiKey: string;
    apiSecret: string;
    accessToken: string;
    accessTokenSecret: string;
  };
  instagram?: {
    accessToken: string;
    accountId: string;
  };
}

export interface PostResult {
  success: boolean;
  postId?: string;
  url?: string;
  error?: string;
}

export class SocialMediaService {
  private static credentials: SocialCredentials = {};

  /**
   * Initialize social media credentials
   */
  static initialize(credentials: SocialCredentials) {
    this.credentials = credentials;
  }

  /**
   * Post to Facebook
   */
  static async postToFacebook(post: SocialPost): Promise<PostResult> {
    try {
      if (!this.credentials.facebook) {
        throw new Error('Facebook credentials not configured');
      }

      const { accessToken, pageId } = this.credentials.facebook;

      // Prepare the post data
      const postData: any = {
        message: post.content,
        access_token: accessToken
      };

      // Add media if present
      if (post.mediaUrls && post.mediaUrls.length > 0) {
        // For simplicity, we'll just use the first image
        // In production, you'd upload media first and get media_id
        postData.link = post.mediaUrls[0];
      }

      // Make API call to Facebook Graph API
      const response = await fetch(
        `https://graph.facebook.com/v18.0/${pageId}/feed`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postData)
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Facebook API error: ${error.error?.message || 'Unknown error'}`);
      }

      const result = await response.json();

      return {
        success: true,
        postId: result.id,
        url: `https://facebook.com/${result.id}`
      };

    } catch (error) {
      console.error('Facebook posting error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Facebook posting failed'
      };
    }
  }

  /**
   * Post to LinkedIn
   */
  static async postToLinkedIn(post: SocialPost): Promise<PostResult> {
    try {
      if (!this.credentials.linkedin) {
        throw new Error('LinkedIn credentials not configured');
      }

      const { accessToken, organizationId } = this.credentials.linkedin;

      // LinkedIn API requires specific author format
      const author = organizationId
        ? `urn:li:organization:${organizationId}`
        : 'urn:li:person:me'; // For personal accounts

      const postData = {
        author: author,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: post.content
            },
            shareMediaCategory: post.mediaUrls && post.mediaUrls.length > 0 ? 'IMAGE' : 'NONE',
            ...(post.mediaUrls && post.mediaUrls.length > 0 && {
              media: post.mediaUrls.map(url => ({
                status: 'READY',
                description: {
                  text: 'Property image'
                },
                media: url,
                title: {
                  text: 'Property'
                }
              }))
            })
          }
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
        }
      };

      const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0'
        },
        body: JSON.stringify(postData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`LinkedIn API error: ${error.message || 'Unknown error'}`);
      }

      const result = await response.json();

      return {
        success: true,
        postId: result.id,
        url: `https://linkedin.com/feed/update/${result.id}`
      };

    } catch (error) {
      console.error('LinkedIn posting error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'LinkedIn posting failed'
      };
    }
  }

  /**
   * Post to Twitter
   */
  static async postToTwitter(post: SocialPost): Promise<PostResult> {
    try {
      if (!this.credentials.twitter) {
        throw new Error('Twitter credentials not configured');
      }

      const { apiKey, apiSecret, accessToken, accessTokenSecret } = this.credentials.twitter;

      // Twitter API v2 endpoint
      const tweetData = {
        text: post.content
      };

      // Add media if present
      if (post.mediaUrls && post.mediaUrls.length > 0) {
        // In production, you'd upload media first and get media_ids
        // For now, we'll just include the first image URL in the text
        tweetData.text += `\n\n${post.mediaUrls[0]}`;
      }

      // Twitter API requires OAuth 1.0a authentication
      // This is a simplified version - in production you'd use a proper OAuth library
      const authHeader = this.generateTwitterAuthHeader(
        apiKey,
        apiSecret,
        accessToken,
        accessTokenSecret,
        tweetData
      );

      const response = await fetch('https://api.twitter.com/2/tweets', {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(tweetData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Twitter API error: ${error.detail || error.title || 'Unknown error'}`);
      }

      const result = await response.json();

      return {
        success: true,
        postId: result.data.id,
        url: `https://twitter.com/i/status/${result.data.id}`
      };

    } catch (error) {
      console.error('Twitter posting error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Twitter posting failed'
      };
    }
  }

  /**
   * Post to Instagram (via Facebook Graph API)
   */
  static async postToInstagram(post: SocialPost): Promise<PostResult> {
    try {
      if (!this.credentials.instagram) {
        throw new Error('Instagram credentials not configured');
      }

      const { accessToken, accountId } = this.credentials.instagram;

      // Instagram requires media upload first
      let mediaId = null;

      if (post.mediaUrls && post.mediaUrls.length > 0) {
        // Upload media first
        const mediaResponse = await fetch(
          `https://graph.facebook.com/v18.0/${accountId}/media`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              image_url: post.mediaUrls[0],
              caption: post.content,
              access_token: accessToken
            })
          }
        );

        if (!mediaResponse.ok) {
          const error = await mediaResponse.json();
          throw new Error(`Instagram media upload error: ${error.error?.message || 'Unknown error'}`);
        }

        const mediaResult = await mediaResponse.json();
        mediaId = mediaResult.id;

        // Wait for media to be ready
        await new Promise(resolve => setTimeout(resolve, 5000));
      }

      // Create the post
      const postData = mediaId ? {
        creation_id: mediaId,
        access_token: accessToken
      } : {
        caption: post.content,
        access_token: accessToken
      };

      const endpoint = mediaId
        ? `${accountId}/media_publish`
        : `${accountId}/media`;

      const response = await fetch(
        `https://graph.facebook.com/v18.0/${endpoint}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postData)
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Instagram API error: ${error.error?.message || 'Unknown error'}`);
      }

      const result = await response.json();

      return {
        success: true,
        postId: result.id,
        url: `https://instagram.com/p/${result.id}`
      };

    } catch (error) {
      console.error('Instagram posting error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Instagram posting failed'
      };
    }
  }

  /**
   * Post to multiple platforms
   */
  static async postToMultiplePlatforms(post: SocialPost, platforms: string[]): Promise<Record<string, PostResult>> {
    const results: Record<string, PostResult> = {};

    for (const platform of platforms) {
      try {
        switch (platform) {
          case 'facebook':
            results.facebook = await this.postToFacebook(post);
            break;
          case 'linkedin':
            results.linkedin = await this.postToLinkedIn(post);
            break;
          case 'twitter':
            results.twitter = await this.postToTwitter(post);
            break;
          case 'instagram':
            results.instagram = await this.postToInstagram(post);
            break;
        }
      } catch (error) {
        results[platform] = {
          success: false,
          error: error instanceof Error ? error.message : 'Posting failed'
        };
      }
    }

    return results;
  }

  /**
   * Generate Twitter OAuth 1.0a authorization header
   */
  private static generateTwitterAuthHeader(
    apiKey: string,
    apiSecret: string,
    accessToken: string,
    accessTokenSecret: string,
    data: any
  ): string {
    // This is a simplified OAuth 1.0a implementation
    // In production, use a proper OAuth library like 'oauth-1.0a'
    const timestamp = Math.floor(Date.now() / 1000);
    const nonce = Math.random().toString(36).substring(2);

    const params = {
      oauth_consumer_key: apiKey,
      oauth_nonce: nonce,
      oauth_signature_method: 'HMAC-SHA1',
      oauth_timestamp: timestamp.toString(),
      oauth_token: accessToken,
      oauth_version: '1.0'
    };

    // Generate signature (simplified)
    const signature = 'simplified_signature';

    return `OAuth oauth_consumer_key="${apiKey}", oauth_nonce="${nonce}", oauth_signature="${signature}", oauth_signature_method="HMAC-SHA1", oauth_timestamp="${timestamp}", oauth_token="${accessToken}", oauth_version="1.0"`;
  }

  /**
   * Get engagement metrics for a post
   */
  static async getEngagementMetrics(platform: string, postId: string): Promise<any> {
    try {
      switch (platform) {
        case 'facebook':
          return await this.getFacebookEngagement(postId);
        case 'linkedin':
          return await this.getLinkedInEngagement(postId);
        case 'twitter':
          return await this.getTwitterEngagement(postId);
        case 'instagram':
          return await this.getInstagramEngagement(postId);
        default:
          throw new Error(`Unsupported platform: ${platform}`);
      }
    } catch (error) {
      console.error(`Error getting ${platform} engagement:`, error);
      return null;
    }
  }

  private static async getFacebookEngagement(postId: string): Promise<any> {
    // Implementation for Facebook engagement metrics
    return { likes: 0, shares: 0, comments: 0 };
  }

  private static async getLinkedInEngagement(postId: string): Promise<any> {
    // Implementation for LinkedIn engagement metrics
    return { likes: 0, shares: 0, comments: 0 };
  }

  private static async getTwitterEngagement(postId: string): Promise<any> {
    // Implementation for Twitter engagement metrics
    return { likes: 0, shares: 0, comments: 0 };
  }

  private static async getInstagramEngagement(postId: string): Promise<any> {
    // Implementation for Instagram engagement metrics
    return { likes: 0, shares: 0, comments: 0 };
  }

  /**
   * Check if credentials are configured for a platform
   */
  static isPlatformConfigured(platform: string): boolean {
    switch (platform) {
      case 'facebook':
        return !!(this.credentials.facebook?.accessToken && this.credentials.facebook?.pageId);
      case 'linkedin':
        return !!this.credentials.linkedin?.accessToken;
      case 'twitter':
        return !!(this.credentials.twitter?.apiKey && this.credentials.twitter?.accessToken);
      case 'instagram':
        return !!(this.credentials.instagram?.accessToken && this.credentials.instagram?.accountId);
      default:
        return false;
    }
  }

  /**
   * Get configured platforms
   */
  static getConfiguredPlatforms(): string[] {
    const platforms = ['facebook', 'linkedin', 'twitter', 'instagram'];
    return platforms.filter(platform => this.isPlatformConfigured(platform));
  }
}