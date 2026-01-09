import { useState } from 'react'
import { useComments, useCreateComment, useDeleteComment } from '@/hooks/useComments'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  MessageSquare, 
  Reply, 
  Trash2, 
  Send,
  MoreHorizontal,
} from 'lucide-react'
import { formatDateTime, getInitials, cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface CommentSectionProps {
  entityType: string
  entityId: string
  title?: string
}

export function CommentSection({ entityType, entityId, title = 'Reacties' }: CommentSectionProps) {
  const { user } = useAuth()
  const { comments, isLoading } = useComments(entityType, entityId)
  const createComment = useCreateComment()
  
  const [newComment, setNewComment] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    await createComment.mutateAsync({
      entityType,
      entityId,
      content: newComment.trim(),
    })
    setNewComment('')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-muted-foreground" />
        <h3 className="font-semibold">{title}</h3>
        {comments && comments.length > 0 && (
          <span className="text-sm text-muted-foreground">
            ({comments.length})
          </span>
        )}
      </div>

      {/* New Comment Form */}
      <form onSubmit={handleSubmit} className="flex gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={user?.user_metadata?.avatar_url} />
          <AvatarFallback>
            {getInitials(user?.user_metadata?.full_name || user?.email || 'U')}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <Textarea
            placeholder="Schrijf een reactie..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={2}
            className="resize-none"
          />
          <div className="flex justify-end">
            <Button 
              type="submit" 
              size="sm"
              disabled={!newComment.trim() || createComment.isPending}
            >
              <Send className="mr-2 h-4 w-4" />
              {createComment.isPending ? 'Bezig...' : 'Plaatsen'}
            </Button>
          </div>
        </div>
      </form>

      {/* Comments List */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-16 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : comments && comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              entityType={entityType}
              entityId={entityId}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-4">
          Nog geen reacties. Wees de eerste!
        </p>
      )}
    </div>
  )
}

interface CommentItemProps {
  comment: {
    id: string
    user_id: string
    content: string
    created_at: string
    parent_id: string | null
    user_profiles: {
      full_name: string | null
      avatar_url: string | null
    } | null
    replies?: CommentItemProps['comment'][]
  }
  entityType: string
  entityId: string
  isReply?: boolean
}

function CommentItem({ comment, entityType, entityId, isReply = false }: CommentItemProps) {
  const { user } = useAuth()
  const deleteComment = useDeleteComment()
  const createComment = useCreateComment()
  
  const [showReply, setShowReply] = useState(false)
  const [replyContent, setReplyContent] = useState('')

  const isOwnComment = user?.id === comment.user_id
  const authorName = comment.user_profiles?.full_name || 'Onbekend'

  const handleReply = async () => {
    if (!replyContent.trim()) return

    await createComment.mutateAsync({
      entityType,
      entityId,
      content: replyContent.trim(),
      parentId: comment.id,
    })
    setReplyContent('')
    setShowReply(false)
  }

  const handleDelete = () => {
    deleteComment.mutate({ id: comment.id, entityType, entityId })
  }

  return (
    <div className={cn("flex gap-3", isReply && "ml-11")}>
      <Avatar className="h-8 w-8">
        <AvatarImage src={comment.user_profiles?.avatar_url || undefined} />
        <AvatarFallback>{getInitials(authorName)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="rounded-lg bg-muted p-3">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">{authorName}</span>
              <span className="text-xs text-muted-foreground">
                {formatDateTime(comment.created_at)}
              </span>
            </div>
            {isOwnComment && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem 
                    className="text-destructive"
                    onClick={handleDelete}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Verwijderen
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
        </div>
        
        {/* Reply button */}
        {!isReply && (
          <div className="mt-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={() => setShowReply(!showReply)}
            >
              <Reply className="mr-1 h-3 w-3" />
              Reageren
            </Button>
          </div>
        )}

        {/* Reply form */}
        {showReply && (
          <div className="mt-2 flex gap-2">
            <Textarea
              placeholder="Schrijf een reactie..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              rows={2}
              className="resize-none text-sm"
            />
            <div className="flex flex-col gap-1">
              <Button 
                size="sm"
                onClick={handleReply}
                disabled={!replyContent.trim() || createComment.isPending}
              >
                <Send className="h-4 w-4" />
              </Button>
              <Button 
                size="sm"
                variant="ghost"
                onClick={() => setShowReply(false)}
              >
                Annuleren
              </Button>
            </div>
          </div>
        )}

        {/* Nested replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-3 space-y-3">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                entityType={entityType}
                entityId={entityId}
                isReply
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
