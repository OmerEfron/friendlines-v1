/**
 * Internal backend contracts for FriendLines modules.
 * Defines input/output shapes for Conversation Engine, Thread Manager,
 * Editorial Analyzer, Article Generator, and Edition Builder.
 */

/** @typedef {'user' | 'reporter'} MessageRole */

/**
 * Conversation Engine
 * @typedef {Object} ConversationEngineInput
 * @property {string} userId - FriendLines user id
 * @property {string} content - Message content
 * @property {MessageRole} role - Sender role
 *
 * @typedef {Object} ConversationEngineOutput
 * @property {string} messageId - Persisted message id
 * @property {string[]} [clarifyingQuestions] - Up to 3 follow-up questions
 * @property {boolean} shouldPublish - Whether to trigger editorial pipeline
 */

/**
 * Thread Manager
 * @typedef {Object} ThreadInput
 * @property {string} title
 * @property {number} [importanceScore]
 *
 * @typedef {Object} ThreadUpdate
 * @property {string} threadId
 * @property {string} [status] - 'open' | 'closed'
 * @property {number} [importanceScore]
 *
 * @typedef {Object} EventInput
 * @property {string} threadId
 * @property {string} summary
 * @property {string} [sentiment]
 * @property {number} [significanceScore]
 */

/**
 * Editorial Analyzer
 * @typedef {Object} EditorialInput
 * @property {string} threadId
 * @property {string} eventSummary
 * @property {Object[]} messageContext - Recent messages for context
 *
 * @typedef {Object} EditorialOutput
 * @property {1|2|3} tier - Article tier (600-900, 300-500, 80-180 words)
 * @property {boolean} shouldPublish
 * @property {string} [rationale]
 */

/**
 * Article Generator
 * @typedef {Object} ArticleInput
 * @property {string} threadId
 * @property {string} eventSummary
 * @property {1|2|3} tier
 * @property {Object[]} messageContext
 *
 * @typedef {Object} ArticleOutput
 * @property {string} headline
 * @property {string} subheadline
 * @property {string} body - Must satisfy tier word range
 */

/**
 * Edition Builder
 * @typedef {Object} EditionInput
 * @property {string} date - ISO date string
 * @property {Object[]} articles - Articles to group
 *
 * @typedef {Object} EditionOutput
 * @property {string} editionId
 * @property {string} date
 * @property {Object} topStory - Primary article
 * @property {Object[]} briefs - Secondary articles
 */
