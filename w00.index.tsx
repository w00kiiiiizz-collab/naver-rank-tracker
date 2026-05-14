"use clientㄴ

import { useState } from "react"
import { Search, Smartphone, Monitor, Users, Calendar, Copy, Check, Clock, TrendingUp, Megaphone, ShoppingBag, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Spinner } from "@/components/ui/spinner"

const AGE_GROUPS = [
  { id: "all", label: "전체" },
  { id: "10s", label: "10대" },
  { id: "20s", label: "20대" },
  { id: "30s", label: "30대" },
  { id: "40s", label: "40대" },
  { id: "50s", label: "50대+" },
]

interface RankingData {
  adRank: { page: number; position: number } | null
  organicRank: { page: number; position: number } | null
}

interface AnalysisResult {
  shopping: RankingData
  plusStore: RankingData
  timestamp: string
}

function LiveIndicator() {
  return (
    <div className="flex items-center gap-2">
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#03C75A] opacity-75"></span>
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#03C75A]"></span>
      </span>
      <span className="text-xs font-semibold text-[#03C75A] tracking-wide">실시간</span>
    </div>
  )
}

function RankBadge({ page, position }: { page: number; position: number }) {
  let colorClass = ""
  if (page === 1) {
    colorClass = "bg-[#03C75A] text-white"
  } else if (page <= 3) {
    colorClass = "bg-[#f59e0b] text-white"
  } else {
    colorClass = "bg-[#ef4444] text-white"
  }
  
  return (
    <div className="text-center">
      <div className={`inline-flex items-center justify-center px-4 py-2 rounded-lg ${colorClass}`}>
        <span className="text-2xl font-bold">{page}</span>
        <span className="text-sm ml-1">페이지</span>
        <span className="text-2xl font-bold ml-2">{position}</span>
        <span className="text-sm ml-1">위</span>
      </div>
    </div>
  )
}

function NotFoundBadge() {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gray-100 text-gray-500">
        <AlertCircle className="h-5 w-5 mr-2" />
        <span className="text-lg font-medium">순위 미발견</span>
      </div>
    </div>
  )
}

function RankingCard({ 
  title, 
  icon: Icon, 
  data,
  isLoading,
  iconColor
}: { 
  title: string
  icon: React.ElementType
  data: RankingData | null
  isLoading: boolean
  iconColor: string
}) {
  return (
    <Card className="border border-gray-200 shadow-sm bg-white">
      <CardHeader className="pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconColor}`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
          <CardTitle className="text-lg font-bold text-gray-900">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8 gap-3">
            <Spinner className="h-8 w-8 text-[#03C75A]" />
            <p className="text-sm text-gray-500">네이버에서 실시간 데이터를 가져오는 중...</p>
          </div>
        ) : data ? (
          <div className="space-y-6">
            {/* Ad Rank */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100">
              <div className="flex items-center gap-2 mb-3">
                <Megaphone className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-semibold text-orange-700">광고 상품 순위</span>
                {data.adRank && (
                  <Badge className="bg-orange-500 text-white text-xs ml-auto">광고 노출 중</Badge>
                )}
              </div>
              {data.adRank ? (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">현재</span>
                  <RankBadge page={data.adRank.page} position={data.adRank.position} />
                </div>
              ) : (
                <NotFoundBadge />
              )}
            </div>
            
            {/* Organic Rank */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100">
              <div className="flex items-center gap-2 mb-3">
                <ShoppingBag className="h-4 w-4 text-green-600" />
                <span className="text-sm font-semibold text-green-700">일반 상품 순위</span>
              </div>
              {data.organicRank ? (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">현재</span>
                  <RankBadge page={data.organicRank.page} position={data.organicRank.position} />
                </div>
              ) : (
                <NotFoundBadge />
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 mb-4">
              <Search className="h-7 w-7 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">분석 결과가 없습니다</p>
            <p className="text-xs text-gray-400 mt-1">키워드를 입력하고 분석을 시작하세요</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function NaverRankTracker() {
  const [keyword, setKeyword] = useState("")
  const [targetInfo, setTargetInfo] = useState("")
  const [device, setDevice] = useState<"mobile" | "pc">("mobile")
  const [gender, setGender] = useState<"all" | "male" | "female">("all")
  const [selectedAges, setSelectedAges] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState("shopping")

  const toggleAge = (ageId: string) => {
    setSelectedAges(prev => 
      prev.includes(ageId) 
        ? prev.filter(a => a !== ageId)
        : [...prev, ageId]
    )
  }

  const handleAnalyze = async () => {
    if (!keyword.trim()) return
    
    setIsLoading(true)
    
    // Simulate API call to Naver
    await new Promise(resolve => setTimeout(resolve, 2500))
    
    // Mock data - in production, this would fetch from Naver
    const mockResults: AnalysisResult = {
      shopping: {
        adRank: Math.random() > 0.3 ? { page: 1, position: Math.floor(Math.random() * 5) + 1 } : null,
        organicRank: Math.random() > 0.2 ? { page: Math.floor(Math.random() * 3) + 1, position: Math.floor(Math.random() * 20) + 1 } : null,
      },
      plusStore: {
        adRank: Math.random() > 0.4 ? { page: 1, position: Math.floor(Math.random() * 3) + 1 } : null,
        organicRank: Math.random() > 0.3 ? { page: Math.floor(Math.random() * 2) + 1, position: Math.floor(Math.random() * 15) + 1 } : null,
      },
      timestamp: new Date().toLocaleString("ko-KR", { 
        timeZone: "Asia/Seoul",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      }),
    }
    
    setResult(mockResults)
    setIsLoading(false)
  }

  const copyToClipboard = () => {
    if (!result) return
    
    const currentData = activeTab === "shopping" ? result.shopping : result.plusStore
    const tabName = activeTab === "shopping" ? "가격비교/쇼핑 전체" : "플러스스토어"
    
    let text = `[네이버 순위 분석 결과]\n`
    text += `키워드: ${keyword}\n`
    text += `타겟: ${targetInfo || "미지정"}\n`
    text += `분석 영역: ${tabName}\n`
    text += `기기: ${device === "mobile" ? "모바일" : "PC"}\n\n`
    
    if (currentData.adRank) {
      text += `광고 순위: ${currentData.adRank.page}페이지 ${currentData.adRank.position}위\n`
    } else {
      text += `광고 순위: 미발견\n`
    }
    
    if (currentData.organicRank) {
      text += `일반 순위: ${currentData.organicRank.page}페이지 ${currentData.organicRank.position}위\n`
    } else {
      text += `일반 순위: 미발견\n`
    }
    
    text += `\n실시간 데이터 기준: ${result.timestamp}`
    
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#03C75A]">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">네이버 실시간 순위 분석기</h1>
                <p className="text-xs text-gray-500">MP인터랙티브 실무 지원 툴</p>
              </div>
            </div>
            <LiveIndicator />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Search Form Card */}
        <Card className="mb-6 border border-gray-200 shadow-sm bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Search className="h-5 w-5 text-[#03C75A]" />
              검색 조건 설정
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Keyword Input */}
            <div className="space-y-2">
              <Label htmlFor="keyword" className="text-sm font-semibold text-gray-700">
                키워드 입력
              </Label>
              <Input
                id="keyword"
                placeholder="검색할 키워드를 입력하세요"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="h-12 text-base border-gray-300 focus:border-[#03C75A] focus:ring-[#03C75A]"
              />
            </div>

            {/* Target Info Input */}
            <div className="space-y-2">
              <Label htmlFor="targetInfo" className="text-sm font-semibold text-gray-700">
                상품 정보
              </Label>
              <Input
                id="targetInfo"
                placeholder="스토어명 또는 상품 URL"
                value={targetInfo}
                onChange={(e) => setTargetInfo(e.target.value)}
                className="h-12 text-base border-gray-300 focus:border-[#03C75A] focus:ring-[#03C75A]"
              />
            </div>

            {/* Settings Row */}
            <div className="grid gap-5 md:grid-cols-3">
              {/* Device */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  기기 설정
                </Label>
                <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setDevice("mobile")}
                    className={`flex-1 py-2.5 px-4 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                      device === "mobile"
                        ? "bg-[#03C75A] text-white"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Smartphone className="h-4 w-4" />
                    모바일
                  </button>
                  <button
                    type="button"
                    onClick={() => setDevice("pc")}
                    className={`flex-1 py-2.5 px-4 text-sm font-medium transition-colors flex items-center justify-center gap-2 border-l border-gray-300 ${
                      device === "pc"
                        ? "bg-[#03C75A] text-white"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Monitor className="h-4 w-4" />
                    PC
                  </button>
                </div>
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  성별
                </Label>
                <div className="flex gap-3">
                  {[
                    { value: "all", label: "전체" },
                    { value: "male", label: "남성" },
                    { value: "female", label: "여성" },
                  ].map((option) => (
                    <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value={option.value}
                        checked={gender === option.value}
                        onChange={(e) => setGender(e.target.value as "all" | "male" | "female")}
                        className="w-4 h-4 text-[#03C75A] border-gray-300 focus:ring-[#03C75A]"
                      />
                      <span className="text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Age Groups */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  연령대
                </Label>
                <div className="flex flex-wrap gap-2">
                  {AGE_GROUPS.map((age) => (
                    <button
                      key={age.id}
                      type="button"
                      onClick={() => toggleAge(age.id)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        selectedAges.includes(age.id)
                          ? "bg-[#03C75A] text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {age.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Analyze Button */}
            <Button
              onClick={handleAnalyze}
              disabled={isLoading || !keyword.trim()}
              className="w-full h-14 text-lg font-bold bg-[#03C75A] hover:bg-[#02b350] text-white shadow-md"
              size="lg"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Spinner className="h-5 w-5" />
                  분석 중...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  실시간 순위 분석하기
                </span>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results Section */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-2 mb-4 bg-white border border-gray-200 h-12 p-1 rounded-xl">
            <TabsTrigger 
              value="shopping" 
              className="rounded-lg text-sm font-semibold data-[state=active]:bg-[#03C75A] data-[state=active]:text-white"
            >
              가격비교 / 쇼핑 전체
            </TabsTrigger>
            <TabsTrigger 
              value="plusStore"
              className="rounded-lg text-sm font-semibold data-[state=active]:bg-[#03C75A] data-[state=active]:text-white"
            >
              네이버 플러스 스토어
            </TabsTrigger>
          </TabsList>

          <TabsContent value="shopping">
            <RankingCard
              title="가격비교 / 쇼핑 전체"
              icon={ShoppingBag}
              data={result?.shopping || null}
              isLoading={isLoading}
              iconColor="bg-[#03C75A]"
            />
          </TabsContent>

          <TabsContent value="plusStore">
            <RankingCard
              title="네이버 플러스 스토어"
              icon={TrendingUp}
              data={result?.plusStore || null}
              isLoading={isLoading}
              iconColor="bg-[#6366f1]"
            />
          </TabsContent>
        </Tabs>

        {/* Bottom Actions */}
        {result && (
          <div className="mt-6 space-y-4">
            {/* Copy Button */}
            <Button
              onClick={copyToClipboard}
              variant="outline"
              className="w-full h-12 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              {copied ? (
                <span className="flex items-center gap-2 text-[#03C75A]">
                  <Check className="h-5 w-5" />
                  복사 완료!
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Copy className="h-5 w-5" />
                  분석 결과 복사하기
                </span>
              )}
            </Button>

            {/* Timestamp */}
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>실시간 데이터 분석 기준: 2026-05-14</span>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
