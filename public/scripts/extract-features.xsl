<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:cblte="http://www.cblte.org"
    xmlns:xs="http://www.w3.org/2001/XMLSchema" exclude-result-prefixes="xs" version="2.0">

    <!-- This stylesheet was produced by Christopher D. Land. It contains user-defined functions that are useful for processing the OpenText.org linguistic annotations. -->
    <!--************
            *** OVERVIEW ***
            *************-->
    <!-- 
        
        * The 'part' keyword signals that linear segments are in view. A non-discontinuous node is treated as having one 'part' (i.e. the whole segment).
        * The 'all' keyword similarly deals with discontinuity, signalling the selection of all parts of the relevant markup (by means of @next and @prev).  
        * The attribute names 'feat' and 'func' signal that string values are returned; the longer 'functions' and 'features' signal that elements are returned.
    
    -->
    <!--*********************************************************************************************************************************************
    *** FUNCTIONS THAT SELECT THE PARTS OF A DISCONTINUOUS UNIT OR STRUCTURE AND/OR MARKUP RELEVANT TO AN ENTIRE DISCONTINUOUS UNIT OR STRUCTURE. ***
    **********************************************************************************************************************************************-->
    <!-- When passed a set of elements, this function will select the initial parts of the relevant units or structures. -->
    <xsl:function name="cblte:initial-part" as="element()*">
        <xsl:param name="node" as="element()*"/>
        <xsl:for-each select="$node">
            <xsl:choose>
                <xsl:when test="@prev">
                    <xsl:sequence select="cblte:initial-part(id(@prev))"/>
                    <!--
                    <xsl:sequence select="cblte:initial-part(key('id', @prev, root()))"/>-->
                </xsl:when>
                <xsl:otherwise>
                    <xsl:sequence select="."/>
                </xsl:otherwise>
            </xsl:choose>
        </xsl:for-each>
    </xsl:function>
    <!-- When passed a set of elements, this function will select all preceding parts of the relevant units or structures. -->
    <!-- If entire units or structures are desired, the cblte:all-parts() function should be called instead. -->
    <xsl:function name="cblte:preceding-parts" as="element()*">
        <xsl:param name="node" as="element()*"/>
        <xsl:for-each select="$node">
            <xsl:if test="@prev">
                <xsl:variable name="prev" as="element()" select="id(@prev)"/>
                <!--
                <xsl:variable name="prev" as="element()" select="key('id', @prev, root())"/>-->
                <xsl:sequence select="cblte:preceding-parts($prev) | $prev"/>
            </xsl:if>
        </xsl:for-each>
    </xsl:function>
    <!-- When passed a set of elements, this function will select all following parts of the relevant units or structures. -->
    <!-- If entire units or structures are desired, the cblte:all-parts() function should be called instead. -->
    <xsl:function name="cblte:following-parts" as="element()*">
        <xsl:param name="node" as="element()*"/>
        <xsl:for-each select="$node">
            <xsl:if test="@next">
                <!--                
                <xsl:variable name="next" as="element()" select="key('id', @next, root())"/>-->
                <xsl:variable name="next" as="element()" select="id(@next)"/>
                <xsl:sequence select="$next | cblte:following-parts($next)"/>
            </xsl:if>
        </xsl:for-each>
    </xsl:function>
    <!-- When passed a set of elements, this function will select all parts of the relevant lexicogrammatical units or structures. -->
    <!-- If a single node is desired for each unit or structure, the cblte:join() or cblte:merge() function should be called instead. -->
    <xsl:function name="cblte:all-parts" as="element()*">
        <xsl:param name="node" as="element()*"/>
        <xsl:for-each select="$node">
            <xsl:if test="@prev">
                <!--                
                <xsl:variable name="prev" as="element()" select="key('id', @prev, root())"/>-->
                <xsl:variable name="prev" as="element()" select="id(@prev)"/>
                <xsl:sequence select="cblte:preceding-parts($prev) | $prev"/>
            </xsl:if>
            <xsl:sequence select="."/>
            <xsl:if test="@next">
                <!--                
                <xsl:variable name="next" as="element()" select="key('id', @next, root())"/>-->
                <xsl:variable name="next" as="element()" select="id(@next)"/>
                <xsl:sequence select="$next | cblte:following-parts($next)"/>
            </xsl:if>
        </xsl:for-each>
    </xsl:function>
    <!--***********************************************************************
    *** FUNCTIONS THAT RETURN ATTRIBUTE VALUES REGARDLESS OF DISCONTINUITY. ***
    ************************************************************************-->
    <!-- When passed one or more <m> elements (typically units), this function will return their semantic functions. -->
    <xsl:function name="cblte:func" as="xs:string*">
        <xsl:param name="node" as="element(m)*"/>
        <xsl:value-of select="$node/ancestor::m[@func][1]/@func"/>
    </xsl:function>
    <!-- When passed one or more <w> elements, this function will return their types. -->
    <xsl:function name="cblte:type" as="xs:string*">
        <xsl:param name="node" as="element(w)*"/>
        <xsl:value-of select="cblte:initial-part($node)/@type"/>
    </xsl:function>
    <!-- When passed one or more <w> elements, this function will return their c. -->
    <xsl:function name="cblte:class" as="xs:string*">
        <xsl:param name="node" as="element(w)*"/>
        <xsl:value-of select="cblte:initial-part($node)/@class"/>
    </xsl:function>
    <!-- When passed any element, this function will return the @xml:id of its initial part (which is useful as an identifier for the whole). -->
    <xsl:function name="cblte:id" as="xs:string*">
        <xsl:param name="node" as="element()*"/>
        <xsl:value-of select="cblte:initial-part($node)/@xml:id"/>
    </xsl:function>
    <!--***********************************************************************
    *** FUNCTIONS THAT SELECT THE CORE, MARKER(S), OR ADJUNCT(S) OR A UNIT. ***
    ************************************************************************-->
    <!-- When passed one or more <w> elements, this function will return its core word(s). -->
    <xsl:function name="cblte:core" as="element(w)*">
        <xsl:param name="node" as="element(w)*"/>
        <xsl:sequence
            select="cblte:all-parts($node)/outermost(descendant::w[not(@type = ('junction', 'path'))])[@type = 'word' and not(@bound)]"
        />
    </xsl:function>
    <!-- When passed one or more <w> elements, this function will return its marker(s). -->
    <xsl:function name="cblte:marker" as="element(w)*">
        <xsl:param name="node" as="element(w)*"/>
        <xsl:sequence
            select="cblte:all-parts($node)/outermost(descendant::w[not(@type = ('junction', 'path'))])[@type = 'word' and @bound]"
        />
    </xsl:function>
    <!-- When passed one or more <w> elements, this function will return its operator(s). -->
    <xsl:function name="cblte:operator" as="element(w)*">
        <xsl:param name="node" as="element(w)*"/>
        <xsl:sequence
            select="cblte:all-parts($node)/outermost(descendant::w)[@type = 'word' and @bound]"/>
    </xsl:function>
    <!-- When passed one or more <w> elements, this function will return its adjunct(s). -->
    <xsl:function name="cblte:adjunct" as="element(w)*">
        <xsl:param name="node" as="element(w)*"/>
        <xsl:sequence
            select="cblte:all-parts($node)/outermost(descendant::w[not(@type = ('junction', 'path'))])[@type = 'cluster']"
        />
    </xsl:function>
    <!--*******************************************************************************************************************
    *** FUNCTIONS THAT SELECT MARKUP EVEN WHEN IT DOES NOT APPEAR DIRECTLY ON THE RELEVANT NODE OR ON A PRECEDING PART. ***
    ********************************************************************************************************************-->
    <!-- When passed any <m> element that encodes a @unit, this function will return the names of its semantic features (up to but not past their exponence via other units). -->
    <!-- As regards recursion, all features are selected with no distinction made between multiple paths through the system. -->
    <xsl:function name="cblte:unit-feats" as="xs:string*">
        <xsl:param name="node" as="element()*"/>
        <xsl:for-each select="$node[@unit]/*">
            <xsl:choose>
                <xsl:when test="@feat">
                    <xsl:value-of select="@feat"/>
                    <xsl:sequence select="cblte:unit-feats(.)"/>
                </xsl:when>
                <xsl:when test="w">
                    <xsl:sequence select="cblte:unit-feats(.)"/>
                </xsl:when>
                <xsl:when test="@unit"/>
            </xsl:choose>
        </xsl:for-each>
    </xsl:function>
    <xsl:function name="cblte:core-feats" as="xs:string*">
        <xsl:param name="node" as="element(w)"/>
        <xsl:variable name="core" as="element(w)*" select="cblte:core($node)"/>
        <xsl:sequence select="$node/descendant::m[descendant::w intersect $core]/@feat"/>
    </xsl:function>
    <!-- When passed one or more elements (typically, any <w> element or an <m> node that encodes a @unit), this function will return the <m> elements that encode those elements' semantic features (up to but not past their exponence by other units/wordings). -->
    <!-- For recursive units, all features are selected with no distinction made between multiple paths through the system. -->
    <xsl:function name="cblte:features" as="element()*">
        <xsl:param name="node" as="element()*"/>
        <xsl:for-each select="$node[@unit or @type = ('speech', 'cluster', 'word')]/*">
            <xsl:choose>
                <xsl:when test="@feat">
                    <xsl:sequence select="., cblte:features(.)"/>
                </xsl:when>
                <xsl:when test="w[@type = ('junction', 'path')]">
                    <xsl:sequence select="cblte:features(.)"/>
                </xsl:when>
                <xsl:when test="@unit or @type = ('speech', 'cluster', 'word')"/>
            </xsl:choose>
        </xsl:for-each>
    </xsl:function>
    <!-- When passed any <m> element that encodes a @unit, this function will return the names of its functional elements. -->
    <xsl:function name="cblte:unit-funcs" as="xs:string*">
        <xsl:param name="node" as="element(m)"/>
        <xsl:sequence
            select="$node[@unit]/outermost(descendant::m[@func] | descendant::w[@type = ('cluster', 'word')])/@func"
        />
    </xsl:function>
    <!-- When passed one or more elements (typically, any <w> element or an <m> node that encodes a @unit), this function will return the <m> elements that encode those elements' functional elements. -->
    <!-- For recursive units, all features are selected with no distinction made between multiple paths through the system. -->
    <xsl:function name="cblte:functions" as="element()*">
        <xsl:param name="node" as="element()*"/>
        <xsl:sequence select="$node/outermost(descendant::m[@func])"/>
    </xsl:function>
    <!--**********************************************************************
    *** FUNCTIONS THAT CALCULATE VALUES NOT EXPLICITLY ENCODED IN THE XML. ***
    ***********************************************************************-->
    <!-- When passed a node, this function will return an integer that represents the depth of the relevant unit or element within the relevant annotation layer. -->
    <xsl:function name="cblte:depth" as="xs:integer">
        <xsl:param name="node" as="element()"/>
        <xsl:for-each select="$node">
            <xsl:variable name="speech" as="element(e)" select="ancestor::e[@type = 'speech'][1]"/>
            <xsl:choose>
                <xsl:when test="self::m">
                    <xsl:sequence
                        select="count(ancestor::m[@type = 'unit'][ancestor::m is $speech]) + 1"/>
                </xsl:when>
                <xsl:when test="self::w">
                    <xsl:sequence
                        select="count(ancestor::w[@type = 'cluster'][ancestor::m is $speech]) + 1"/>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:sequence select="0"/>
                </xsl:otherwise>
            </xsl:choose>
        </xsl:for-each>
    </xsl:function>



    <!-- Trim whitespace -->
    <!--<xsl:strip-space elements="*"/>-->

    <!-- Add root element -->
    <xsl:template match="/">
        <root>
            <xsl:apply-templates/>
        </root>
    </xsl:template>

    <!-- Remove header -->
    <xsl:template match="header"/>

    <!-- Process moves and retain verse references -->
    <xsl:template match="move">
        <move chStart="{data(./@chStart)}" vStart="{data(./@vStart)}" chEnd="{data(./@chEnd)}"
            vEnd="{data(./@vEnd)}">
            <xsl:apply-templates/>
        </move>
    </xsl:template>

    <!-- Process stages -->
    <xsl:template match="stage">
        <stage key="{data(./@stageId)}" title="{data(./@stageTitle)}">
            <xsl:apply-templates/>
        </stage>
    </xsl:template>

    <!-- Wrap direct discourse -->
    <xsl:template match="m[@feat = 'semiotic']/m[@feat = 'expression']/e[@type = 'speech']">

        <xsl:variable name="quotation_marking">
            <xsl:choose>
                <xsl:when test="../m[@feat = 'quotation_marker']">quotation_marker</xsl:when>
                <xsl:when test="../m[@feat = '!quotation_marker']">!quotation_marker</xsl:when>
            </xsl:choose>
        </xsl:variable>

        <xsl:variable name="speaker_shift">
            <xsl:value-of select="boolean(../m[@feat = 'speaker_shift_tbd'])"/>
        </xsl:variable>

        <xsl:variable name="orientation_shift">
            <xsl:value-of select="boolean(../m[@feat = 'orientation_shift_tbd'])"/>
        </xsl:variable>

        <directDiscourse ostentatious="{data(./@ostentatious)}"
            quotation_marking="{$quotation_marking}" speaker_shift="{$speaker_shift}"
            orientation_shift="{$orientation_shift}">
            <xsl:apply-templates/>
        </directDiscourse>
    </xsl:template>

    <xsl:template match="m[@unit]">
        <featureSet unitType="{data(./@unit)}">
            <features><xsl:value-of select="cblte:unit-feats(.)"/></features>
            <xsl:apply-templates/>
        </featureSet>
    </xsl:template>

</xsl:stylesheet>
