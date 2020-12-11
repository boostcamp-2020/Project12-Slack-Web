import React, { useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { RootState } from '@store'
import { getThreads, setCurrentThread } from '@store/reducer/thread.reducer'
import { GetThreadResponseType } from '@type/thread.type'
import A from '@atom'
import O from '@organism'
import myIcon from '@constant/icon'
import { IconType } from '@atom/Icon'
import { TextType } from '@atom/Text'
import getDMChannelTitle from '@util/getDMChannelTitle'
import { ThreadListProps } from '.'
import Styled from './ThreadList.style'

const ThreadList = ({
  channelInfo,
  threads,
  handleSubViewOpen,
  handleSubViewHeader,
  handleSubViewBody,
}: ThreadListProps) => {
  const threadEndRef = useRef<HTMLDivElement>(null)
  const threadListEl = useRef<HTMLDivElement>(null)

  const dispatch = useDispatch()
  const { threadList } = useSelector((state: RootState) => state.threadStore)
  const { channelId } = useParams<{
    channelId: string
  }>()

  const scrollToBottom = () => {
    if (threadEndRef) {
      threadEndRef.current!.scrollIntoView()
    }
  }

  useEffect(scrollToBottom, [threads[threads.length - 1]])

  const handleScrollTop = () => {
    const { scrollTop } = threadListEl.current as HTMLDivElement
    if (scrollTop <= 150) {
      dispatch(
        getThreads.request({
          channelId: +channelInfo.id,
          lastThreadId: threadList[0].id,
        }),
      )
    }
  }

  const channelIcon =
    // eslint-disable-next-line no-nested-ternary
    channelInfo.type === 'DM'
      ? myIcon.message
      : channelInfo.type === 'PUBLIC'
      ? myIcon.hashtag
      : myIcon.lock

  const messageEditorPlaceHolder =
    channelInfo.type === 'DM'
      ? getDMChannelTitle(channelInfo.memberMax3, channelInfo.memberCount)
      : `#${channelInfo.name}`

  const subViewHeader = (
    <Styled.ThreadSubViewHeaderWrapper>
      <A.Text customStyle={threadTextStyle}>Thread</A.Text>

      <Styled.ChannelNameWrapper>
        <A.Icon icon={channelIcon} customStyle={iconStyle} />
        <A.Text customStyle={subViewChannelNameTextStyle}>
          {channelInfo.type === 'DM'
            ? `Direct message with ${channelInfo.memberCount} others`
            : channelInfo.name}
        </A.Text>
      </Styled.ChannelNameWrapper>
    </Styled.ThreadSubViewHeaderWrapper>
  )

  const threadDetail = <O.ThreadDetail channelId={+channelId} />

  const handleReplyButtonClick = (thread: GetThreadResponseType) => {
    dispatch(setCurrentThread.request(thread))
    handleSubViewOpen()
    handleSubViewHeader(subViewHeader)
    handleSubViewBody(threadDetail)
  }

  return (
    <Styled.ChannelMainContainer>
      <Styled.ThreadListContainer ref={threadListEl} onScroll={handleScrollTop}>
        <Styled.ThreadListTop>
          <Styled.ThreadTypeIconWrapper>
            <A.Icon icon={channelIcon} />
          </Styled.ThreadTypeIconWrapper>

          <Styled.ColumnFlexContainer>
            <A.Text customStyle={threadListTopTextStyle}>
              {channelInfo.type === 'DM' ? (
                'This is the very beginning of your group conversation'
              ) : (
                <>
                  {'This is the very beginning of the '}
                  <A.Icon
                    icon={channelIcon}
                    customStyle={{ ...threadListTopTextStyle, color: 'blue' }}
                  />
                  <A.Text customStyle={channelNameTextStyle}>
                    {channelInfo.name}
                  </A.Text>
                  channel
                </>
              )}
            </A.Text>
            <A.Text customStyle={channelDescTextStyle}>
              {channelInfo.createdAt &&
                `This ${
                  channelInfo.type === 'DM' ? 'room' : 'channel'
                } was created on ${new Date(
                  channelInfo.createdAt,
                ).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}.`}
            </A.Text>
          </Styled.ColumnFlexContainer>
        </Styled.ThreadListTop>

        {threads.map((thread, index, arr) => {
          const prevThread = index > 0 ? arr[index - 1] : undefined

          const sameUser = !!(
            prevThread && prevThread.User.id === thread.User.id
          )
          const hasReply = thread.replyCount !== 0

          const prevHasReply = prevThread && prevThread.replyCount !== 0

          const continuous = sameUser && !hasReply && !prevHasReply
          return (
            <O.MessageCard
              data={thread}
              type="THREAD"
              continuous={continuous}
              onReplyButtonClick={handleReplyButtonClick}
              key={thread.id}
            />
          )
        })}
        <Styled.ThreadListBottom ref={threadEndRef} />
      </Styled.ThreadListContainer>

      <Styled.EditorContainer>
        <O.MessageEditor
          placeHolder={`Send a message to ${messageEditorPlaceHolder}`}
        />
      </Styled.EditorContainer>
    </Styled.ChannelMainContainer>
  )
}

const threadTextStyle: TextType.StyleAttributes = {
  fontWeight: '800',
  fontSize: '1.6rem',
  margin: '2px 0',
}

const iconStyle: IconType.StyleAttributes = {
  color: 'darkGrey',
  fontSize: '1.2rem',
  margin: '0 3px 0 0',
}

const subViewChannelNameTextStyle: TextType.StyleAttributes = {
  color: 'darkGrey',
  fontSize: '1.2rem',
}

const threadListTopTextStyle: TextType.StyleAttributes = {
  fontSize: '1.5rem',
  fontWeight: '600',
}

const channelNameTextStyle: TextType.StyleAttributes = {
  ...threadListTopTextStyle,
  color: 'blue',
  margin: '0 5px 0 3px',
}

const channelDescTextStyle: TextType.StyleAttributes = {
  fontSize: '1.5rem',
  color: 'darkGrey',
}

export default ThreadList
